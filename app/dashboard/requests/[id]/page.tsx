"use client";

import { useState, useTransition, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateRequest, getRequestById } from "@/actions/requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Plus, Trash2, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ItemSchema = z.object({
    description: z.string().min(1, "Categoria é obrigatória"),
    quantity: z.coerce.number().min(1, "Quantidade deve ser maior que 0"),
    unit: z.string().min(1, "Unidade é obrigatória"),
});

const RequestSchema = z.object({
    justification: z.string().min(10, "Justificativa deve ter pelo menos 10 caracteres"),
    dueDate: z.string().min(1, "Data desejada é obrigatória"),
    items: z.array(ItemSchema).min(1, "Adicione pelo menos um item"),
});

const CATEGORIES = [
    "Eletrônicos",
    "Informática",
    "Material de Escritório",
    "Limpeza e Higiene",
    "Alimentos e Bebidas",
    "Serviços",
    "Manutenção",
    "Construção",
    "Outros"
];

const UNITS = [
    "Item",
    "Kg",
    "Metro",
    "Litro",
    "Caixa",
    "Pacote",
    "Peça",
    "Conjunto"
];

export default function EditRequestPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);
    const [isApproved, setIsApproved] = useState(false);
    const [sequenceId, setSequenceId] = useState<number | null>(null);

    const form = useForm<z.infer<typeof RequestSchema>>({
        resolver: zodResolver(RequestSchema),
        defaultValues: {
            justification: "",
            dueDate: "",
            items: [{ description: "", quantity: 1, unit: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    useEffect(() => {
        const fetchRequest = async () => {
            const result = await getRequestById(id);
            if (result.error) {
                setError(result.error);
                setIsLoading(false);
                return;
            }
            if (result.request) {
                const req = result.request;
                setIsApproved(req.status === "APPROVED");
                setSequenceId(req.sequenceId);

                form.reset({
                    justification: req.justification,
                    dueDate: req.dueDate ? new Date(req.dueDate).toISOString().split("T")[0] : "",
                    items: req.items as any[],
                });
            }
            setIsLoading(false);
        };
        fetchRequest();
    }, [id, form]);

    const onSubmit = (values: z.infer<typeof RequestSchema>, isDraft: boolean = false) => {
        if (isApproved) return;

        setError("");
        setSuccess("");

        startTransition(() => {
            updateRequest(id, values, isDraft).then((data) => {
                if (data?.error) {
                    setError(data.error);
                }
                if (data?.success) {
                    setSuccess(data.success as string);
                    setTimeout(() => {
                        router.push("/dashboard/requests");
                    }, 1000);
                }
            });
        });
    };

    if (isLoading) {
        return <div className="p-8 text-center text-zinc-500">Carregando...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/requests">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Editar Solicitação {sequenceId ? `#SC${sequenceId}` : ""}
                    </h1>
                    <p className="text-slate-500 mt-2">
                        {isApproved
                            ? "Esta solicitação foi aprovada e não pode ser editada."
                            : "Atualize os dados da sua solicitação de compra"}
                    </p>
                </div>
            </div>

            {isApproved && (
                <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                    <Lock className="h-4 w-4" />
                    <AlertTitle>Modo Leitura</AlertTitle>
                    <AlertDescription>
                        Esta solicitação já foi aprovada e está bloqueada para edições.
                    </AlertDescription>
                </Alert>
            )}

            <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 p-8 shadow-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="justification"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Justificativa *</FormLabel>
                                    <FormControl>
                                        <textarea
                                            {...field}
                                            disabled={isPending || isApproved}
                                            placeholder="Descreva o motivo da solicitação..."
                                            className="flex min-h-[120px] w-full rounded-xl border border-neutral-200 bg-white/50 px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 backdrop-blur-sm"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Data Desejada *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            min={new Date().toISOString().split("T")[0]}
                                            disabled={isPending || isApproved}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">Itens</Label>
                                {!isApproved && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            append({ description: "", quantity: 1, unit: "" })
                                        }
                                        disabled={isPending}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Adicionar Item
                                    </Button>
                                )}
                            </div>

                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="grid grid-cols-12 gap-3 p-4 rounded-xl bg-slate-50/50 border border-slate-200/50"
                                >
                                    <div className="col-span-6">
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select
                                                            disabled={isPending || isApproved}
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecione a categoria" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {CATEGORIES.map((category) => (
                                                                    <SelectItem key={category} value={category}>
                                                                        {category}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.quantity`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            min="1"
                                                            placeholder="Qtd"
                                                            disabled={isPending || isApproved}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-3">
                                        <FormField
                                            control={form.control}
                                            name={`items.${index}.unit`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select
                                                            disabled={isPending || isApproved}
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Unidade" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {UNITS.map((unit) => (
                                                                    <SelectItem key={unit} value={unit}>
                                                                        {unit}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-1 flex items-start">
                                        {!isApproved && fields.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                disabled={isPending}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
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

                        {!isApproved && (
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => form.handleSubmit((data) => onSubmit(data, true))()}
                                    disabled={isPending}
                                    className="flex-1"
                                >
                                    Salvar Rascunho
                                </Button>
                                <Button type="submit" disabled={isPending} className="flex-1">
                                    Salvar Alterações
                                </Button>
                            </div>
                        )}
                    </form>
                </Form>
            </div>
        </div>
    );
}
