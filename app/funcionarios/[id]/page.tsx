import { getEmployeeById } from "@/actions/employees";
import { EmployeeForm } from "@/components/employees/employee-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { Users } from "lucide-react";

export default async function EditEmployeePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const { employee, error } = await getEmployeeById(id);

    if (error || !employee) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Users className="h-6 w-6 text-slate-500" />
                    Editar Funcionário
                </h1>
                <p className="text-slate-500">Gerencie os dados e permissões deste colaborador.</p>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Dados do Funcionário</CardTitle>
                </CardHeader>
                <CardContent>
                    <EmployeeForm initialData={employee} isEditing />
                </CardContent>
            </Card>
        </div>
    );
}
