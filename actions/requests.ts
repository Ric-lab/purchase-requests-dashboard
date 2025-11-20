"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const ItemSchema = z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
    quantity: z.number().min(1, "Quantidade deve ser maior que 0"),
    unit: z.string().min(1, "Unidade é obrigatória"),
});

const RequestSchema = z.object({
    justification: z.string().min(10, "Justificativa deve ter pelo menos 10 caracteres"),
    dueDate: z.string().min(1, "Data desejada é obrigatória"),
    items: z.array(ItemSchema).min(1, "Adicione pelo menos um item"),
});

export async function getRequests() {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Não autenticado" };
    }

    try {
        const requests = await db.purchaseRequest.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        return { success: true, requests };
    } catch (error) {
        console.error("Error fetching requests:", error);
        return { error: "Erro ao buscar solicitações" };
    }
}

export async function createRequest(
    values: z.infer<typeof RequestSchema>,
    isDraft: boolean = false
) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Não autenticado" };
    }

    const validatedFields = RequestSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Campos inválidos!" };
    }

    const { justification, dueDate, items } = validatedFields.data;

    try {
        // Generate unique code
        const timestamp = Date.now();
        const code = `REQ-${timestamp}`;

        const request = await db.purchaseRequest.create({
            data: {
                code,
                userId: session.user.id,
                justification,

                dueDate: new Date(dueDate),
                items: items as any, // Prisma will handle Json type
                status: isDraft ? "DRAFT" : "PENDING",
            },
        });

        revalidatePath("/dashboard/requests");

        return { success: "Solicitação criada com sucesso!", requestId: request.id };
    } catch (error) {
        console.error("Error creating request:", error);
        return { error: "Erro ao criar solicitação" };
    }
}
