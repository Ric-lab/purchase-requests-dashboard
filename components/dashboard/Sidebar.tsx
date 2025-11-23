"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, CheckSquare, Settings, LogOut, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

interface SidebarProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

const navItems = [
    { href: "/dashboard", label: "Visão Geral", icon: Home },
    { href: "/dashboard/requests", label: "Minhas Solicitações", icon: FileText },
    { href: "/dashboard/approvals", label: "Aprovações", icon: CheckSquare },
    { href: "/dashboard/suppliers", label: "Fornecedores", icon: Truck },
    { href: "/dashboard/settings", label: "Configurações", icon: Settings },
];

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col bg-slate-50/80 backdrop-blur-xl border-r border-slate-200/50">
            {/* Logo / Header */}
            <div className="flex h-16 items-center px-6 border-b border-slate-200/50">
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                    ShopAI
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all",
                                isActive
                                    ? "bg-black/5 text-black"
                                    : "text-slate-600 hover:bg-black/[0.02] hover:text-slate-900"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User Menu */}
            <div className="border-t border-slate-200/50 p-4">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/50">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-semibold">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                            {user.name || "User"}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                            {user.email}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="mt-2 flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                >
                    <LogOut className="h-5 w-5" />
                    Sair
                </button>
            </div>
        </div>
    );
}
