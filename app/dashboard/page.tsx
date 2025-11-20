export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Visão Geral</h1>
                <p className="text-slate-500 mt-2">
                    Bem-vindo ao ShopAI Dashboard
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 p-6 shadow-lg">
                    <h3 className="text-sm font-medium text-slate-500">Total de Solicitações</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
                </div>

                <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 p-6 shadow-lg">
                    <h3 className="text-sm font-medium text-slate-500">Pendentes</h3>
                    <p className="text-3xl font-bold text-amber-500 mt-2">0</p>
                </div>

                <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 p-6 shadow-lg">
                    <h3 className="text-sm font-medium text-slate-500">Aprovadas</h3>
                    <p className="text-3xl font-bold text-emerald-500 mt-2">0</p>
                </div>
            </div>
        </div>
    );
}
