import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Loader2, Download } from "lucide-react";
import { toast } from "sonner";

interface Sale {
  id: string;
  product_codigo: string;
  sold_at: string;
  channel: string;
  final_price: number;
  buyer_name: string;
  buyer_contact: string;
  notes: string;
}

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

interface Props { onChange: () => void; }

export function SalesHistory({ onChange }: Props) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));

  useEffect(() => { load(); }, [month]);

  async function load() {
    setLoading(true);
    const [year, m] = month.split("-").map(Number);
    const from = new Date(year, m - 1, 1).toISOString();
    const to = new Date(year, m, 1).toISOString();
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .gte("sold_at", from)
      .lt("sold_at", to)
      .order("sold_at", { ascending: false });
    if (error) toast.error("Erro: " + error.message);
    else setSales((data as any) || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este registro de venda? O status do produto não muda.")) return;
    const { error } = await supabase.from("sales").delete().eq("id", id);
    if (error) toast.error("Erro: " + error.message);
    else {
      toast.success("Registro excluído");
      load();
      onChange();
    }
  }

  const filtered = useMemo(() => sales.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.product_codigo.toLowerCase().includes(q) || s.buyer_name?.toLowerCase().includes(q);
  }), [sales, search]);

  const totalMes = filtered.reduce((acc, s) => acc + Number(s.final_price || 0), 0);

  function exportCsv() {
    if (filtered.length === 0) return toast.info("Sem vendas para exportar");
    const headers = ["Data", "Codigo", "Canal", "Valor", "Comprador", "Contato", "Observacoes"];
    const rows = filtered.map((s) => [
      new Date(s.sold_at).toLocaleString("pt-BR"),
      s.product_codigo,
      s.channel,
      Number(s.final_price).toFixed(2),
      s.buyer_name,
      s.buyer_contact,
      s.notes,
    ].map(csvEscape).join(";"));
    const csv = "\ufeff" + [headers.join(";"), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendas-${month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-muted-foreground">Mês</label>
          <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-[180px]" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-muted-foreground">Buscar</label>
          <Input placeholder="Código ou nome do comprador…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline" onClick={exportCsv}>
          <Download /> Exportar CSV
        </Button>
        <div className="bg-card border border-border rounded-2xl px-4 py-2">
          <div className="text-xs text-muted-foreground">Faturamento do mês</div>
          <div className="font-serif text-xl">{brl(totalMes)} · {filtered.length} venda(s)</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Comprador</TableHead>
                <TableHead>Obs.</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhuma venda no período</TableCell></TableRow>
              )}
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{new Date(s.sold_at).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell className="font-mono text-xs">{s.product_codigo}</TableCell>
                  <TableCell>{s.channel}</TableCell>
                  <TableCell>{brl(Number(s.final_price))}</TableCell>
                  <TableCell>{s.buyer_name || <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">{s.notes}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(s.id)}>
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
