import { useMetrics } from "@/hooks/useMetrics";
import { Package, CheckCircle2, Clock, ShoppingBag, Wallet, TrendingUp, Receipt } from "lucide-react";
import { Loader2 } from "lucide-react";

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Props { refreshKey: number; }

export function MetricsBar({ refreshKey }: Props) {
  const { metrics, loading } = useMetrics(refreshKey);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 flex justify-center">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  const cards = [
    { icon: Package, label: "Total no acervo", value: metrics.total, accent: "text-foreground" },
    { icon: CheckCircle2, label: "Disponíveis", value: metrics.disponivel, accent: "text-emerald-700" },
    { icon: Clock, label: "Reservadas", value: metrics.reservado, accent: "text-amber-700" },
    { icon: ShoppingBag, label: "Vendidas", value: metrics.vendido, accent: "text-muted-foreground" },
    { icon: Wallet, label: "Valor do estoque", value: brl(metrics.estoqueValor), accent: "text-foreground" },
    { icon: TrendingUp, label: "Vendas do mês", value: `${metrics.vendasMesQtde} · ${brl(metrics.vendasMesValor)}`, accent: "text-foreground" },
    { icon: Receipt, label: "Ticket médio", value: brl(metrics.ticketMedio), accent: "text-foreground" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <c.icon className="w-3.5 h-3.5" />
            <span>{c.label}</span>
          </div>
          <div className={`font-serif text-2xl ${c.accent}`}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}
