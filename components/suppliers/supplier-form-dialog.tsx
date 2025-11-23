"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, Phone, User, FileText, Truck } from "lucide-react";

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

interface SupplierFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof SupplierSchema>) => Promise<void>;
    initialData?: z.infer<typeof SupplierSchema> | null;
}

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

export function SupplierFormDialog({
    open,
    onOpenChange,
    onSubmit,
    initialData,
}: SupplierFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        } else {
            form.reset({
                name: "",
                cnpj: "",
                email: "",
                contactName: "",
                phone: "",
                categories: [],
            });
        }
    }, [initialData, form, open]);

    const handleSubmit = async (values: z.infer<typeof SupplierSchema>) => {
        setIsSubmitting(true);
        try {
            await onSubmit(values);
            onOpenChange(false);
        } finally {
            setIsSubmitting(false);
        }
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-2xl">
                <DialogHeader className="px-6 pt-6 pb-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800/50">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Truck className="w-5 h-5 text-primary" />
                        </div>
                        <DialogTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                            {initialData ? "Editar Fornecedor" : "Novo Fornecedor"}
                        </DialogTitle>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 ml-12">
                        Preencha os dados abaixo para cadastrar um novo parceiro comercial.
                    </p>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="px-6 py-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Razão Social */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Razão Social
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                <Input
                                                    placeholder="Ex: Tech Supplies Ltda"
                                                    className="pl-9 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 transition-colors"
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
                                        <FormLabel className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            CNPJ
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                <Input
                                                    placeholder="00.000.000/0001-00"
                                                    className="pl-9 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 transition-colors"
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
                                        <FormLabel className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Email Corporativo
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                <Input
                                                    placeholder="contato@empresa.com"
                                                    className="pl-9 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 transition-colors"
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
                                        <FormLabel className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Nome do Contato
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                <Input
                                                    placeholder="Ex: João Silva"
                                                    className="pl-9 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 transition-colors"
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
                                        <FormLabel className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Telefone / WhatsApp
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                <Input
                                                    placeholder="(11) 99999-9999"
                                                    className="pl-9 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 transition-colors"
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
                                    <FormItem className="col-span-2">
                                        <FormLabel className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 block">
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
                                                                ? "bg-primary hover:bg-primary/90 shadow-sm"
                                                                : "bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
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

                        <DialogFooter className="pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-end gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm px-6"
                            >
                                {isSubmitting ? "Salvando..." : "Salvar Fornecedor"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
