import { EmployeeForm } from "@/components/employees/employee-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function NewEmployeePage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Users className="h-6 w-6 text-slate-500" />
                    Novo Funcionário
                </h1>
                <p className="text-slate-500">Preencha os dados para cadastrar um novo colaborador.</p>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Dados do Funcionário</CardTitle>
                </CardHeader>
                <CardContent>
                    <EmployeeForm />
                </CardContent>
            </Card>
        </div>
    );
}
