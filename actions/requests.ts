"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { Prisma } from "@prisma/client";

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
            where: {
                userId: session.user.id,
                deletedAt: null, // Soft delete filter
            },
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
        const request = await db.purchaseRequest.create({
            data: {
                // code is now optional and we rely on sequenceId
                userId: session.user.id,
                justification,
                dueDate: new Date(dueDate),
                items: items as Prisma.InputJsonValue,
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

export async function deleteRequest(requestId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Não autenticado" };
    }

    try {
        await db.purchaseRequest.update({
            where: { id: requestId },
            data: {
                deletedAt: new Date(),
                deletedBy: session.user.id,
            },
        });

        revalidatePath("/dashboard/requests");
        return { success: "Solicitação excluída com sucesso!" };
    } catch (error) {
        console.error("Error deleting request:", error);
        return { error: "Erro ao excluir solicitação" };
    }
}

export async function approveRequest(requestId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Não autenticado" };
    }

    try {
        await db.purchaseRequest.update({
            where: { id: requestId },
            data: {
                status: "APPROVED",
                approvedAt: new Date(),
                approvedBy: session.user.id,
            },
        });

        revalidatePath("/dashboard/requests");
        return { success: "Solicitação aprovada com sucesso!" };
    } catch (error) {
        console.error("Error approving request:", error);
        return { error: "Erro ao aprovar solicitação" };
    }
}

export async function getRequestById(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Não autenticado" };
    }

    try {
        const request = await db.purchaseRequest.findUnique({
            where: { id },
        });

        if (!request) {
            return { error: "Solicitação não encontrada" };
        }

        // Check ownership or permissions if needed
        if (request.userId !== session.user.id) {
            return { error: "Acesso negado" };
        }

        return { success: true, request };
    } catch (error) {
        console.error("Error fetching request:", error);
        return { error: "Erro ao buscar solicitação" };
    }
}

export async function updateRequest(
    id: string,
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
        const existingRequest = await db.purchaseRequest.findUnique({
            where: { id },
        });

        if (!existingRequest) {
            return { error: "Solicitação não encontrada" };
        }

        if (existingRequest.userId !== session.user.id) {
            return { error: "Acesso negado" };
        }

        if (existingRequest.status === "APPROVED") {
            return { error: "Solicitação já aprovada não pode ser editada" };
        }

        await db.purchaseRequest.update({
            where: { id },
            data: {
                justification,
                dueDate: new Date(dueDate),
                items: items as Prisma.InputJsonValue,
                status: isDraft ? "DRAFT" : "PENDING",
                updatedAt: new Date(),
                updatedBy: session.user.id,
            },
        });

        revalidatePath("/dashboard/requests");
        revalidatePath(`/dashboard/requests/${id}`);

        return { success: "Solicitação atualizada com sucesso!" };
    } catch (error) {
        console.error("Error updating request:", error);
        return { error: "Erro ao atualizar solicitação" };
    }
}
