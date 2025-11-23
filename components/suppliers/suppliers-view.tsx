"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SupplierCard } from "./supplier-card";
import Link from "next/link";

interface Supplier {
    id: string;
    name: string;
    cnpj: string;
    email: string;
    contactName: string;
    phone: string;
    categories: string[];
}

interface SuppliersViewProps {
    initialSuppliers: Supplier[];
}

export function SuppliersView({ initialSuppliers }: SuppliersViewProps) {
    const router = useRouter();
    const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSuppliers = suppliers.filter((supplier) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.categories.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                        placeholder="Buscar fornecedores..."
                        className="pl-10 bg-white/60 backdrop-blur-xl border-neutral-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Link href="/dashboard/suppliers/new">
                    <Button className="bg-neutral-900 text-white hover:bg-neutral-800">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Fornecedor
                    </Button>
                </Link>
            </div>

            {filteredSuppliers.length === 0 ? (
                <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 p-12 shadow-lg text-center">
                    <Truck className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Nenhum fornecedor encontrado
                    </h3>
                    <p className="text-slate-500">
                        Cadastre seus parceiros para gerenciar cotações.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredSuppliers.map((supplier) => (
                        <SupplierCard
                            key={supplier.id}
                            supplier={supplier}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
