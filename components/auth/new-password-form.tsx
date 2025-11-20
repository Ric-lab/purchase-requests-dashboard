"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/auth";
import { CardWrapper } from "@/components/auth/CardWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum of 6 characters required",
    }),
});

export const NewPasswordForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            newPassword(values, token)
                .then((data) => {
                    if (data?.error) {
                        setError(data.error);
                    }
                    if (data?.success) {
                        setSuccess(data.success);
                    }
                });
        });
    };

    return (
        <CardWrapper
            headerLabel="Enter a new password"
            backButtonLabel="Back to login"
            backButtonHref="/login"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="******"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {error && (
                        <div className="bg-red-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500">
                            <p>{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
                            <p>{success}</p>
                        </div>
                    )}
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                        variant="default"
                    >
                        Reset password
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};
