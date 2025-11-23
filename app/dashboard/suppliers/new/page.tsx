"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createSupplier } from "@/actions/suppliers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Building2, Mail, Phone, User, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Masking functions
const maskCNPJ = (value: string) => {
    return value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .substring(0, 18);
};

const maskPhone = (value: string) => {
    return value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .substring(0, 15);
};

const SupplierSchema = z.object({
    name: z.string().min(1, "Razão Social é obrigatória"),
    cnpj: z.string().min(18, "CNPJ incompleto"),
    email: z.string().email("Email inválido"),
    contactName: z.string().min(1, "Nome do contato é obrigatório"),
    phone: z.string().min(15, "Telefone incompleto"),
    categories: z.array(z.string()).min(1, "Selecione pelo menos uma categoria"),
});

const AVAILABLE_CATEGORIES = [
    "Eletrônicos",
    "Informática",
    "Material de Escritório",
    "Limpeza e Higiene",
    "Alimentos e Bebidas",
    "Serviços",
    "Manutenção",
    "Construção",
    "Outros",
];

export default function NewSupplierPage() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof SupplierSchema>>({
        resolver: zodResolver(SupplierSchema),
        defaultValues: {
            name: "",
            cnpj: "",
            email: "",
            contactName: "",
            phone: "",
            categories: [],
        },
    });

    const onSubmit = (values: z.infer<typeof SupplierSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            createSupplier(values).then((data) => {
                if (data?.error) {
                    setError(data.error);
                }
                if (data?.success) {
                    setSuccess(data.success as string);
                    setTimeout(() => {
                        router.push("/dashboard/suppliers");
                    }, 1000);
                }
            });
        });
    };

    const toggleCategory = (category: string) => {
        const current = form.getValues("categories");
        if (current.includes(category)) {
            form.setValue(
                "categories",
                current.filter((c) => c !== category)
            );
        } else {
            form.setValue("categories", [...current, category]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/suppliers">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Novo Fornecedor</h1>
                    <p className="text-slate-500 mt-2">
                        Preencha os dados abaixo para cadastrar um novo parceiro comercial.
                    </p>
                </div>
            </div>

            <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 p-8 shadow-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Razão Social */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>
                                            Razão Social
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                <Input
                                                    placeholder="Ex: Tech Supplies Ltda"
                                                    className="pl-9"
                                                    disabled={isPending}
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* CNPJ */}
                            <FormField
                                control={form.control}
                                name="cnpj"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            CNPJ
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                <Input
                                                    placeholder="00.000.000/0001-00"
                                                    className="pl-9"
                                                    disabled={isPending}
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(maskCNPJ(e.target.value));
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Email Corporativo
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                <Input
                                                    placeholder="contato@empresa.com"
                                                    className="pl-9"
                                                    disabled={isPending}
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Contato */}
                            <FormField
                                control={form.control}
                                name="contactName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Nome do Contato
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                <Input
                                                    placeholder="Ex: João Silva"
                                                    className="pl-9"
                                                    disabled={isPending}
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Telefone */}
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Telefone / WhatsApp
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                <Input
                                                    placeholder="(11) 99999-9999"
                                                    className="pl-9"
                                                    disabled={isPending}
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(maskPhone(e.target.value));
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Categorias */}
                            <FormField
                                control={form.control}
                                name="categories"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel className="mb-3 block">
                                            Categorias de Atuação
                                        </FormLabel>
                                        <div className="flex flex-wrap gap-2">
                                            {AVAILABLE_CATEGORIES.map((category) => {
                                                const isSelected = field.value.includes(category);
                                                return (
                                                    <Badge
                                                        key={category}
                                                        variant={isSelected ? "default" : "outline"}
                                                        className={`
                                                            cursor-pointer px-3 py-1.5 text-sm font-normal transition-all
                                                            ${isSelected
                                                                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                                                                : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                                                            }
                                                        `}
                                                        onClick={() => toggleCategory(category)}
                                                    >
                                                        {category}
                                                    </Badge>
                                                );
                                            })}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/15 p-3 rounded-md text-sm text-red-500">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-emerald-500/15 p-3 rounded-md text-sm text-emerald-500">
                                {success}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <Link href="/dashboard/suppliers">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isPending}
                                >
                                    Cancelar
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="bg-slate-900 hover:bg-slate-800"
                            >
                                {isPending ? "Salvando..." : "Salvar Fornecedor"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
