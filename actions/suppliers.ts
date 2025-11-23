"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

const SupplierSchema = z.object({
    name: z.string().min(1, "Razão Social é obrigatória"),
    cnpj: z.string().min(14, "CNPJ inválido"), // Basic length check, frontend does mask
    email: z.string().email("Email inválido"),
    contactName: z.string().min(1, "Nome do contato é obrigatório"),
    phone: z.string().min(10, "Telefone inválido"),
    categories: z.array(z.string()).min(1, "Selecione pelo menos uma categoria"),
});

export async function getSuppliers() {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Não autenticado" };
    }

    try {
        const suppliers = await db.supplier.findMany({
            where: {
                deletedAt: null, // Soft delete filter
            },
            orderBy: { createdAt: "desc" },
        });

        return { success: true, suppliers };
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        return { error: "Erro ao buscar fornecedores" };
    }
}

export async function getSupplierById(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Não autenticado" };
    }

    try {
        const supplier = await db.supplier.findUnique({
            where: { id },
        });

        if (!supplier) {
            return { error: "Fornecedor não encontrado" };
        }

        return { success: true, supplier };
    } catch (error) {
        console.error("Error fetching supplier:", error);
        return { error: "Erro ao buscar fornecedor" };
    }
}

export async function createSupplier(values: z.infer<typeof SupplierSchema>) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Não autenticado" };
    }

    const validatedFields = SupplierSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Campos inválidos!" };
    }

    const { name, cnpj, email, contactName, phone, categories } = validatedFields.data;

    try {
        // Check for duplicate CNPJ
        const existingSupplier = await db.supplier.findUnique({
            where: { cnpj },
        });

        if (existingSupplier) {
            return { error: "CNPJ já cadastrado!" };
        }

        await db.supplier.create({
            data: {
                name,
                cnpj,
                email,
                contactName,
                phone,
                categories: categories as Prisma.InputJsonValue,
                createdBy: session.user.id,
                // updatedBy is not strictly needed on create but good for consistency if we want
            },
        });

        revalidatePath("/dashboard/suppliers");
        return { success: "Fornecedor criado com sucesso!" };
    } catch (error) {
        console.error("Error creating supplier:", error);
        return { error: "Erro ao criar fornecedor" };
    }
}

export async function updateSupplier(id: string, values: z.infer<typeof SupplierSchema>) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Não autenticado" };
    }

    const validatedFields = SupplierSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Campos inválidos!" };
    }

    const { name, cnpj, email, contactName, phone, categories } = validatedFields.data;

    try {
        await db.supplier.update({
            where: { id },
            data: {
                name,
                cnpj,
                email,
                contactName,
                phone,
                categories: categories as Prisma.InputJsonValue,
                updatedBy: session.user.id,
                updatedAt: new Date(), // Explicitly updating timestamp
            },
        });

        revalidatePath("/dashboard/suppliers");
        return { success: "Fornecedor atualizado com sucesso!" };
    } catch (error) {
        console.error("Error updating supplier:", error);
        return { error: "Erro ao atualizar fornecedor" };
    }
}

export async function deleteSupplier(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Não autenticado" };
    }

    try {
        await db.supplier.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: session.user.id,
            },
        });

        revalidatePath("/dashboard/suppliers");
        return { success: "Fornecedor excluído com sucesso!" };
    } catch (error) {
        console.error("Error deleting supplier:", error);
        return { error: "Erro ao excluir fornecedor" };
    }
}
