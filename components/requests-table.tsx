"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Check, Trash2, FileText } from "lucide-react";

export type RequestStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";

export interface Request {
    id: string;
    createdAt: string;
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
    const [requests, setRequests] = useState<Request[]>(initialRequests);

    const handleDelete = (id: string) => {
        setRequests((prev) => prev.filter((req) => req.id !== id));
    };

    const handleApprove = (id: string) => {
        setRequests((prev) =>
            prev.map((req) =>
                req.id === id ? { ...req, status: "APPROVED" } : req
            )
        );
    };

    if (requests.length === 0) {
        return (
            <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 p-12 shadow-lg text-center">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Nenhuma solicitação encontrada
                </h3>
                <p className="text-slate-500">
                    Sua lista de solicitações está vazia.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Código</TableHead>
                        <TableHead>Data de Criação</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Unidade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.map((request, index) => (
                        <TableRow key={request.id}>
                            <TableCell className="font-medium">
                                {index + 1}
                            </TableCell>
                            <TableCell>
                                {new Date(request.createdAt).toLocaleDateString("pt-BR")}
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
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                        onClick={() => handleApprove(request.id)}
                                        title="Aprovar"
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
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
    );
}
