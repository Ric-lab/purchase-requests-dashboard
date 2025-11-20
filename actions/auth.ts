"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const ResetSchema = z.object({
    email: z.string().email(),
});

const NewPasswordSchema = z.object({
    password: z.string().min(6),
});

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" };
                default:
                    return { error: "Something went wrong!" };
            }
        }
        throw error;
    }
};

export const resetPasswordRequest = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid email!" };
    }

    const { email } = validatedFields.data;

    const existingUser = await db.user.findUnique({
        where: { email },
    });

    if (!existingUser) {
        return { error: "Email not found!" };
    }

    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

    const existingToken = await db.verificationToken.findFirst({
        where: { identifier: email },
    });

    if (existingToken) {
        await db.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: email,
                    token: existingToken.token,
                },
            },
        });
    }

    await db.verificationToken.create({
        data: {
            identifier: email,
            token,
            expires,
        },
    });

    await sendPasswordResetEmail(email, token);

    return { success: "Reset email sent!" };
};

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token: string | null
) => {
    if (!token) {
        return { error: "Missing token!" };
    }

    const validatedFields = NewPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { password } = validatedFields.data;

    const existingToken = await db.verificationToken.findUnique({
        where: { token },
    });

    if (!existingToken) {
        return { error: "Invalid token!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token has expired!" };
    }

    const existingUser = await db.user.findUnique({
        where: { email: existingToken.identifier },
    });

    if (!existingUser) {
        return { error: "Email does not exist!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
    });

    await db.verificationToken.delete({
        where: { identifier_token: { identifier: existingToken.identifier, token } },
    });

    return { success: "Password updated!" };
};
