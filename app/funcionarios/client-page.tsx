"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { EmployeeSearch } from "@/components/employees/employee-search";

interface Employee {
    id: string;
    name: string;
    email: string;
    department: string;
    access_level: number;
}

interface EmployeesPageProps {
    employees: Employee[];
}

export default function EmployeesPage({ employees }: EmployeesPageProps) {
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);

    useEffect(() => {
        setFilteredEmployees(employees);
    }, [employees]);

    const getTierLabel = (level: number) => {
        switch (level) {
            case 0: return "Básico (0)";
            case 1: return "Analista (1)";
            case 2: return "Gestão (2)";
            case 3: return "Compras (3)";
            case 4: return "Admin (4)";
            default: return `Nível ${level}`;
        }
    };

    const getTierBadgeColor = (level: number) => {
        if (level >= 4) return "bg-purple-100 text-purple-700 hover:bg-purple-100";
        if (level === 3) return "bg-blue-100 text-blue-700 hover:bg-blue-100";
        if (level === 2) return "bg-green-100 text-green-700 hover:bg-green-100";
        return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="h-6 w-6 text-slate-500" />
                        Funcionários
                    </h1>
                    <p className="text-slate-500">
                        {filteredEmployees.length} {filteredEmployees.length === 1 ? 'funcionário' : 'funcionários'}
                        {filteredEmployees.length !== employees.length && ` de ${employees.length}`}
                    </p>
                </div>
                <Link href="/funcionarios/new">
                    <Button className="bg-slate-900 hover:bg-slate-800">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar
                    </Button>
                </Link>
            </div>

            <EmployeeSearch employees={employees} onFilteredChange={setFilteredEmployees} />

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead className="font-semibold text-slate-700">Nome</TableHead>
                            <TableHead className="font-semibold text-slate-700">Departamento</TableHead>
                            <TableHead className="font-semibold text-slate-700">Email</TableHead>
                            <TableHead className="font-semibold text-slate-700">Perfil (Tier)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEmployees?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                    Nenhum funcionário encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredEmployees?.map((employee) => (
                                <TableRow
                                    key={employee.id}
                                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                                >
                                    <TableCell className="font-medium text-slate-900">
                                        <Link href={`/funcionarios/${employee.id}`} className="block w-full h-full">
                                            {employee.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/funcionarios/${employee.id}`} className="block w-full h-full">
                                            {employee.department}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-slate-500">
                                        <Link href={`/funcionarios/${employee.id}`} className="block w-full h-full">
                                            {employee.email}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/funcionarios/${employee.id}`} className="block w-full h-full">
                                            <Badge className={`font-normal ${getTierBadgeColor(employee.access_level)}`}>
                                                {getTierLabel(employee.access_level)}
                                            </Badge>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
