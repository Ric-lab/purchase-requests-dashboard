"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash2, FileText, Search } from "lucide-react";
import { deleteRequest } from "@/actions/requests";

export type RequestStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";

export interface Request {
    id: string;
    sequenceId: number;
    createdAt: string;
    desiredDate: string;
    description: string;
    category: string;
    quantity: number;
    unit: string;
    status: RequestStatus;
}

const statusVariants: Record<RequestStatus, "warning" | "success" | "destructive" | "default"> = {
    DRAFT: "default",
    PENDING: "warning",
    APPROVED: "success",
    REJECTED: "destructive",
};

const statusLabels: Record<RequestStatus, string> = {
    DRAFT: "Rascunho",
    PENDING: "Pendente",
    APPROVED: "Aprovado",
    REJECTED: "Rejeitado",
};

interface RequestsTableProps {
    initialRequests: Request[];
}

export function RequestsTable({ initialRequests }: RequestsTableProps) {
    const router = useRouter();
    const [requests, setRequests] = useState<Request[]>(initialRequests);
    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = async (id: string) => {
        // Optimistic update
        const previousRequests = [...requests];
        setRequests((prev) => prev.filter((req) => req.id !== id));

        const result = await deleteRequest(id);
        if (result.error) {
            // Revert
            setRequests(previousRequests);
            alert(result.error);
        }
    };

    const filteredRequests = requests.filter((request) => {
        const searchLower = searchTerm.toLowerCase();
        const code = `SC${request.sequenceId}`.toLowerCase();

        return (
            code.includes(searchLower) ||
            request.description.toLowerCase().includes(searchLower) ||
            request.category.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="space-y-4">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                    placeholder="Buscar por código, descrição ou categoria..."
                    className="pl-10 bg-white/60 backdrop-blur-xl border-neutral-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredRequests.length === 0 ? (
                <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 p-12 shadow-lg text-center">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Nenhuma solicitação encontrada
                    </h3>
                    <p className="text-slate-500">
                        {searchTerm ? "Tente buscar por outro termo." : "Sua lista de solicitações está vazia."}
                    </p>
                </div>
            ) : (
                <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Código</TableHead>
                                <TableHead>Data de Criação</TableHead>
                                <TableHead>Data Desejada</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Quantidade</TableHead>
                                <TableHead>Unidade</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRequests.map((request) => (
                                <TableRow
                                    key={request.id}
                                    className="cursor-pointer hover:bg-slate-50/50 transition-colors"
                                    onClick={() => router.push(`/dashboard/requests/${request.id}`)}
                                >
                                    <TableCell className="font-medium">
                                        SC{request.sequenceId}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(request.desiredDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate font-medium text-slate-700">
                                        {request.description}
                                    </TableCell>
                                    <TableCell>{request.category}</TableCell>
                                    <TableCell>{request.quantity}</TableCell>
                                    <TableCell>{request.unit}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariants[request.status]}>
                                            {statusLabels[request.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div
                                            className="flex items-center justify-end gap-2"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(request.id)}
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
