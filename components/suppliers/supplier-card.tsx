import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Building2 } from "lucide-react";
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

interface SupplierCardProps {
    supplier: Supplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
    return (
        <Link href={`/dashboard/suppliers/${supplier.id}`}>
            <Card className="group relative overflow-hidden border-neutral-200 bg-white/60 backdrop-blur-xl transition-all hover:shadow-md hover:border-neutral-300 cursor-pointer">
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-semibold text-neutral-900 group-hover:text-primary transition-colors">
                                {supplier.name}
                            </CardTitle>
                            <div className="flex items-center text-sm text-neutral-500">
                                <Building2 className="mr-1 h-3 w-3" />
                                {supplier.cnpj}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 space-y-2 text-sm text-neutral-600">
                        <div className="flex items-center">
                            <span className="font-medium mr-2 text-neutral-900">{supplier.contactName}</span>
                        </div>
                        <div className="flex items-center">
                            <Mail className="mr-2 h-3 w-3 text-neutral-400" />
                            {supplier.email}
                        </div>
                        <div className="flex items-center">
                            <Phone className="mr-2 h-3 w-3 text-neutral-400" />
                            {supplier.phone}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {supplier.categories.map((category) => (
                            <Badge
                                key={category}
                                variant="secondary"
                                className="bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200 transition-colors"
                            >
                                {category}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
