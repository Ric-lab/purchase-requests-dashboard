"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Employee {
    id: string;
    name: string;
    email: string;
    department: string;
    access_level: number;
}

interface EmployeeSearchProps {
    employees: Employee[];
    onFilteredChange: (filtered: Employee[]) => void;
}

export function EmployeeSearch({ employees, onFilteredChange }: EmployeeSearchProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (value: string) => {
        setSearchQuery(value);

        if (!value.trim()) {
            onFilteredChange(employees);
            return;
        }

        const query = value.toLowerCase();
        const filtered = employees.filter((emp) => {
            return (
                emp.name.toLowerCase().includes(query) ||
                emp.email.toLowerCase().includes(query) ||
                emp.department.toLowerCase().includes(query)
            );
        });

        onFilteredChange(filtered);
    };

    const clearSearch = () => {
        setSearchQuery("");
        onFilteredChange(employees);
    };

    return (
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Buscar por nome, email ou departamento..."
                    className="pl-9 pr-9 border-slate-200 focus-visible:ring-slate-900"
                />
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSearch}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-slate-100"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
