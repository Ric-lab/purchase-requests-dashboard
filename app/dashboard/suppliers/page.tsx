import { getSuppliers } from "@/actions/suppliers";
import { SuppliersView } from "@/components/suppliers/suppliers-view";

export default async function SuppliersPage() {
    const result = await getSuppliers();

    if (result.error) {
        return <div>Error: {result.error}</div>;
    }

    // Transform data to match frontend interface (ensure categories is string[])
    const suppliers = (result.suppliers || []).map((s) => ({
        ...s,
        categories: Array.isArray(s.categories) ? (s.categories as string[]) : [],
        createdAt: s.createdAt.toISOString(), // Serialize dates if needed, though client component handles it if passed as props? No, server to client needs serialization usually.
        // Actually, Next.js server components can pass Dates to client components in recent versions, but safer to serialize.
        // Wait, my interface in SuppliersView expects string[] for categories.
    }));

    return (
        <div className="flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                    Fornecedores
                </h1>
                <p className="text-neutral-500">
                    Gerencie sua base de parceiros e contatos.
                </p>
            </div>
            <SuppliersView initialSuppliers={suppliers as any} />
        </div>
    );
}
