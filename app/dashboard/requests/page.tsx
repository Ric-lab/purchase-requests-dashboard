import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RequestsTable, Request } from "@/components/requests-table";
import { getRequests } from "@/actions/requests";

export default async function RequestsPage() {
    const result = await getRequests();

    if (result.error || !result.requests) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-red-500">{result.error || "Erro ao carregar"}</p>
            </div>
        );
    }

    const formattedRequests: Request[] = result.requests.map((req) => {
        // Extract first item details if available
        const items = req.items as any[];
        const firstItem = items?.[0] || {};

        return {
            id: req.id,
            createdAt: req.createdAt.toISOString(),
            description: req.justification,
            category: firstItem.description || "N/A", // Using description as category based on previous form logic
            quantity: firstItem.quantity || 0,
            unit: firstItem.unit || "N/A",
            status: req.status as any,
        };
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Minhas Solicitações</h1>
                    <p className="text-slate-500 mt-2">
                        Gerencie suas solicitações de compra
                    </p>
                </div>
                <Link href="/dashboard/requests/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nova Solicitação
                    </Button>
                </Link>
            </div>

            <RequestsTable initialRequests={formattedRequests} />
        </div>
    );
}
