"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createEmployee, updateEmployee, deleteEmployee } from "@/actions/employees";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Trash2, Save, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const EmployeeSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    department: z.string().min(1, "Departamento é obrigatório"),
    access_level: z.number().min(0).max(4),
});

type EmployeeFormValues = z.infer<typeof EmployeeSchema>;

interface EmployeeFormProps {
    initialData?: EmployeeFormValues & { id: string };
    isEditing?: boolean;
}

export function EmployeeForm({ initialData, isEditing = false }: EmployeeFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(EmployeeSchema),
        defaultValues: initialData || {
            name: "",
            email: "",
            department: "",
            access_level: 0,
        },
    });

    async function onSubmit(data: EmployeeFormValues) {
        setIsLoading(true);
        setError(null);

        try {
            let result;
            if (isEditing && initialData) {
                result = await updateEmployee(initialData.id, data);
            } else {
                result = await createEmployee(data);
            }

            if (result.error) {
                setError(result.error);
            } else {
                router.push("/funcionarios");
                router.refresh();
            }
        } catch (err) {
            setError("Ocorreu um erro inesperado.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete() {
        if (!initialData) return;

        setShowDeleteDialog(false);
        setIsLoading(true);
        setError(null);

        try {
            const result = await deleteEmployee(initialData.id);

            if (result.error) {
                setError(result.error);
                setIsLoading(false);
            } else {
                router.push("/funcionarios");
                router.refresh();
            }
        } catch (err) {
            setError("Erro ao excluir.");
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome Completo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: João Silva" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email (Login)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="joao@empresa.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Departamento</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o departamento" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Vendas">Vendas</SelectItem>
                                            <SelectItem value="TI">TI</SelectItem>
                                            <SelectItem value="Compras">Compras</SelectItem>
                                            <SelectItem value="RH">RH</SelectItem>
                                            <SelectItem value="Financeiro">Financeiro</SelectItem>
                                            <SelectItem value="Operações">Operações</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="access_level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Perfil de Acesso (Tier)</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        defaultValue={String(field.value)}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o nível" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="0">Tier 0 - Básico (Estagiários)</SelectItem>
                                            <SelectItem value="1">Tier 1 - Analista (Plenos/Seniors)</SelectItem>
                                            <SelectItem value="2">Tier 2 - Gestão (Coord/Gerentes)</SelectItem>
                                            <SelectItem value="3">Tier 3 - Compras</SelectItem>
                                            <SelectItem value="4">Tier 4 - Admin (Diretoria)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        {isEditing && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => setShowDeleteDialog(true)}
                                disabled={isLoading}
                                className="bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir Funcionário
                            </Button>
                        )}

                        <div className="flex gap-4 ml-auto">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-slate-900 hover:bg-slate-800">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Salvar Funcionário
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            Confirmar Exclusão
                        </DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
