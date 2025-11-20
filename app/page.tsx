import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();

  // If user is logged in, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Bem-vindo ao ShopAI
          </h1>
          <p className="text-xl text-slate-600">
            Sistema de Gerenciamento de Solicitações de Compra
          </p>
        </div>

        <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 p-8 shadow-lg space-y-6">
          <p className="text-slate-700">
            Faça login para acessar suas solicitações de compra e gerenciar aprovações.
          </p>

          <Link href="/login">
            <Button className="w-full" size="lg">
              Acessar Sistema
            </Button>
          </Link>
        </div>

        <div className="text-sm text-slate-500">
          <p>Sistema desenvolvido com Next.js, Prisma e NextAuth</p>
        </div>
      </div>
    </div>
  );
}
