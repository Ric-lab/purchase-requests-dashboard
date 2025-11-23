"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

const EmployeeSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    department: z.string().min(1, "Departamento é obrigatório"),
    access_level: z.coerce.number().min(0).max(4),
});

// Helper to check if user has permission (Tier 3 or 4)
async function checkPermission(userId: string) {
    const session = await auth();
    if (!session?.user?.email) return false;

    const employee = await db.employee.findUnique({
        where: { email: session.user.email },
    });

    if (!employee) return false;

    // Rule: Access Level >= 3 (Compras and Admin)
    return employee.access_level >= 3;
}

export async function getEmployees(query?: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Não autenticado" };
    }

    try {
        const employees = await db.employee.findMany({
            where: {
                deletedAt: null,
                OR: query ? [
                    { name: { contains: query, mode: "insensitive" } },
                    { email: { contains: query, mode: "insensitive" } },
                ] : undefined,
            },
            orderBy: { name: "asc" },
        });

        return { success: true, employees };
    } catch (error) {
        console.error("Error fetching employees:", error);
        return { error: "Erro ao buscar funcionários" };
    }
}

export async function getEmployeeById(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Não autenticado" };
    }

    try {
        const employee = await db.employee.findUnique({
            where: { id },
        });

        if (!employee) {
            return { error: "Funcionário não encontrado" };
        }

        return { success: true, employee };
    } catch (error) {
        console.error("Error fetching employee:", error);
        return { error: "Erro ao buscar funcionário" };
    }
}

export async function createEmployee(values: z.infer<typeof EmployeeSchema>) {
    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
        return { error: "Não autenticado" };
    }

    const userEmail = session.user.email;

    // Permission Check
    const hasPermission = await checkPermission(session.user.id);
    const totalEmployees = await db.employee.count();
    if (totalEmployees > 0 && !hasPermission) {
        return { error: "Sem permissão para criar funcionários." };
    }

    const validatedFields = EmployeeSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Campos inválidos!" };
    }

    const { name, email, department, access_level } = validatedFields.data;

    try {
        // Only check for ACTIVE employees with the same email
        const existingActiveEmployee = await db.employee.findFirst({
            where: {
                email,
                deletedAt: null  // Only active employees
            },
        });

        // If email is in use by an active employee, return error
        if (existingActiveEmployee) {
            return { error: "Email já cadastrado!" };
        }

        // Email is available (either not used or only used by deleted employees)
        // Create new employee
        const hashedPassword = await bcrypt.hash("Acesso123", 10);

        await db.$transaction(async (tx) => {
            // Create employee
            await tx.employee.create({
                data: {
                    name,
                    email,
                    department,
                    access_level,
                    createdBy: userEmail,
                },
            });

            // Check if User exists (could be deleted)
            const existingUser = await tx.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                // Restore and update the deleted user
                await tx.user.update({
                    where: { email },
                    data: {
                        name,
                        password: hashedPassword,
                        role: access_level === 4 ? UserRole.ADMIN : UserRole.USER,
                        deletedAt: null,  // Restore
                    },
                });
            } else {
                // Create new User
                await tx.user.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword,
                        role: access_level === 4 ? UserRole.ADMIN : UserRole.USER,
                    },
                });
            }
        });

        revalidatePath("/funcionarios");
        return { success: "Funcionário criado com sucesso!" };
    } catch (error) {
        console.error("Error creating employee:", error);
        return { error: "Erro ao criar funcionário" };
    }
}

export async function updateEmployee(id: string, values: z.infer<typeof EmployeeSchema>) {
    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
        return { error: "Não autenticado" };
    }

    const userEmail = session.user.email;

    const hasPermission = await checkPermission(session.user.id);
    if (!hasPermission) {
        return { error: "Sem permissão para editar funcionários." };
    }

    const validatedFields = EmployeeSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Campos inválidos!" };
    }

    const { name, email, department, access_level } = validatedFields.data;

    try {
        const currentUserEmployee = await db.employee.findUnique({ where: { email: userEmail } });
        if (currentUserEmployee && currentUserEmployee.id === id) {
            if (currentUserEmployee.access_level !== access_level) {
                return { error: "Você não pode alterar seu próprio nível de acesso." };
            }
        }

        const existingEmployee = await db.employee.findUnique({
            where: { email },
        });

        if (existingEmployee && existingEmployee.id !== id) {
            return { error: "Email já em uso por outro funcionário!" };
        }

        await db.$transaction(async (tx) => {
            await tx.employee.update({
                where: { id },
                data: {
                    name,
                    email,
                    department,
                    access_level,
                    updatedBy: userEmail,
                    updatedAt: new Date(),
                },
            });

            const user = await tx.user.findUnique({ where: { email: existingEmployee?.email || email } });
            if (user) {
                await tx.user.update({
                    where: { id: user.id },
                    data: {
                        name,
                        email,
                        role: access_level === 4 ? UserRole.ADMIN : UserRole.USER,
                    },
                });
            }
        });

        revalidatePath("/funcionarios");
        revalidatePath(`/funcionarios/${id}`);
        return { success: "Funcionário atualizado com sucesso!" };
    } catch (error) {
        console.error("Error updating employee:", error);
        return { error: "Erro ao atualizar funcionário" };
    }
}

export async function deleteEmployee(id: string) {
    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
        return { error: "Não autenticado" };
    }

    const hasPermission = await checkPermission(session.user.id);
    if (!hasPermission) {
        return { error: "Sem permissão para excluir funcionários." };
    }

    try {
        // Get employee to find associated user
        const employee = await db.employee.findUnique({
            where: { id },
        });

        if (!employee) {
            return { error: "Funcionário não encontrado" };
        }

        // Soft delete both Employee and User in a transaction
        await db.$transaction(async (tx) => {
            // Soft delete employee
            await tx.employee.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                    deletedBy: session.user.email,
                },
            });

            // Soft delete associated user
            await tx.user.updateMany({
                where: {
                    email: employee.email,
                    deletedAt: null  // Only update if not already deleted
                },
                data: {
                    deletedAt: new Date(),
                },
            });
        });

        revalidatePath("/funcionarios");
        return { success: "Funcionário excluído com sucesso!" };
    } catch (error) {
        console.error("Error deleting employee:", error);
        return { error: "Erro ao excluir funcionário" };
    }
}
