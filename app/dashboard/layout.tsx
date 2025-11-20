import { auth } from "@/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar user={session.user} />
            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="container mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
