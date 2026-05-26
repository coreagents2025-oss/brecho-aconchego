import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductForm } from "@/components/admin/ProductForm";
import { MetricsBar } from "@/components/admin/MetricsBar";
import { SalesHistory } from "@/components/admin/SalesHistory";
import { SaleDialog } from "@/components/admin/SaleDialog";
import { BulkActionsBar } from "@/components/admin/BulkActionsBar";
import { Product } from "@/types/product";
import { Loader2, Plus, Pencil, Trash2, Download, LogOut, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [duplicating, setDuplicating] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saleProduct, setSaleProduct] = useState<Product | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/auth");
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) loadProducts();
  }, [isAdmin]);

  async function loadProducts() {
    setLoadingProducts(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) toast.error("Erro ao carregar: " + error.message);
    else setProducts((data as any) || []);
    setLoadingProducts(false);
    setRefreshKey((k) => k + 1);
  }

  async function handleDelete(codigo: string) {
    if (!confirm(`Excluir produto ${codigo}?`)) return;
    const { error } = await supabase.from("products").delete().eq("codigo", codigo);
    if (error) toast.error("Erro: " + error.message);
    else { toast.success("Produto excluído"); loadProducts(); }
  }

  async function handleStatusChange(codigo: string, status: string, current: string) {
    if (status === "Vendido" && current !== "Vendido") {
      const p = products.find((x) => x.codigo === codigo);
      if (p) setSaleProduct(p);
      return;
    }
    if (status !== "Vendido" && current === "Vendido") {
      if (confirm("Reverter de Vendido. Deseja também apagar os registros de venda deste produto?")) {
        await supabase.from("sales").delete().eq("product_codigo", codigo);
      }
    }
    const { error } = await supabase.from("products").update({ status }).eq("codigo", codigo);
    if (error) toast.error("Erro: " + error.message);
    else { toast.success("Status atualizado"); loadProducts(); }
  }

  async function handleImport() {
    if (!confirm("Importar todos os produtos do catálogo do VPS? Produtos existentes (mesmo código) serão atualizados.")) return;
    setImporting(true);
    const { data, error } = await supabase.functions.invoke("import-catalog");
    setImporting(false);
    if (error) toast.error("Erro: " + error.message);
    else { toast.success(`Importação concluída: ${data?.imported ?? 0} produtos`); loadProducts(); }
  }

  function handleDuplicate(p: Product) {
    setEditing(null);
    setDuplicating(p);
    setShowForm(true);
  }

  // Bulk
  async function bulkStatus(status: string) {
    const codigos = Array.from(selected);
    if (status === "Vendido") {
      toast.info("Para marcar como Vendido em massa, registre cada venda individualmente.");
      return;
    }
    const { error } = await supabase.from("products").update({ status }).in("codigo", codigos);
    if (error) toast.error("Erro: " + error.message);
    else { toast.success(`${codigos.length} atualizado(s)`); setSelected(new Set()); loadProducts(); }
  }

  async function bulkDelete() {
    const codigos = Array.from(selected);
    if (!confirm(`Excluir ${codigos.length} produto(s)?`)) return;
    const { error } = await supabase.from("products").delete().in("codigo", codigos);
    if (error) toast.error("Erro: " + error.message);
    else { toast.success("Excluídos"); setSelected(new Set()); loadProducts(); }
  }

  async function bulkDuplicate() {
    const items = products.filter((p) => selected.has(p.codigo));
    const payload = items.map((p) => ({
      codigo: `${p.codigo}-COPIA-${Date.now().toString(36).slice(-4)}`,
      categoria: p.categoria, nome: p.nome, descricao: p.descricao, marca: p.marca,
      tecido: p.tecido, medidas: p.medidas, cor: p.cor, tamanho: p.tamanho,
      tag: p.tag, preco_brl: p.preco_brl, condicao: p.condicao,
      status: "Disponível",
      url_capa: p.url_capa, url_galeria_1: p.url_galeria_1,
      url_galeria_2: p.url_galeria_2, url_galeria_3: p.url_galeria_3,
      url_video: p.url_video,
    }));
    const { error } = await supabase.from("products").insert(payload);
    if (error) toast.error("Erro: " + error.message);
    else { toast.success(`${payload.length} duplicado(s)`); setSelected(new Set()); loadProducts(); }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.categoria && set.add(p.categoria));
    return Array.from(set).sort();
  }, [products]);

  const filtered = products.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (categoryFilter !== "all" && p.categoria !== categoryFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        p.codigo.toLowerCase().includes(s) ||
        p.nome.toLowerCase().includes(s) ||
        p.categoria?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const allChecked = filtered.length > 0 && filtered.every((p) => selected.has(p.codigo));
  const toggleAll = () => {
    if (allChecked) {
      const next = new Set(selected);
      filtered.forEach((p) => next.delete(p.codigo));
      setSelected(next);
    } else {
      const next = new Set(selected);
      filtered.forEach((p) => next.add(p.codigo));
      setSelected(next);
    }
  };
  const toggleOne = (codigo: string) => {
    const next = new Set(selected);
    next.has(codigo) ? next.delete(codigo) : next.add(codigo);
    setSelected(next);
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif">Painel admin</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.open("/", "_blank")}>
              <ExternalLink /> Ver site
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut /> Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 space-y-6">
        <MetricsBar refreshKey={refreshKey} />

        <Tabs defaultValue="produtos">
          <TabsList>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="vendas">Vendas</TabsTrigger>
          </TabsList>

          <TabsContent value="produtos" className="space-y-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Buscar por código, nome ou categoria…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="Disponível">Disponível</SelectItem>
                  <SelectItem value="Reservado">Reservado</SelectItem>
                  <SelectItem value="Vendido">Vendido</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas categorias</SelectItem>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleImport} disabled={importing}>
                {importing ? <Loader2 className="animate-spin" /> : <Download />}
                Importar do VPS
              </Button>
              <Button onClick={() => { setEditing(null); setDuplicating(null); setShowForm(true); }}>
                <Plus /> Novo produto
              </Button>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {loadingProducts ? (
                <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox checked={allChecked} onCheckedChange={toggleAll} />
                      </TableHead>
                      <TableHead>Foto</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 && (
                      <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Nenhum produto</TableCell></TableRow>
                    )}
                    {filtered.map((p) => (
                      <TableRow key={p.codigo} data-state={selected.has(p.codigo) ? "selected" : undefined}>
                        <TableCell>
                          <Checkbox checked={selected.has(p.codigo)} onCheckedChange={() => toggleOne(p.codigo)} />
                        </TableCell>
                        <TableCell>
                          {p.url_capa ? (
                            <img src={p.url_capa} alt={p.nome} className="w-12 h-12 object-cover rounded" />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded" />
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{p.codigo}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{p.nome}</TableCell>
                        <TableCell>{p.categoria}</TableCell>
                        <TableCell>R$ {Number(p.preco_brl).toFixed(2)}</TableCell>
                        <TableCell>
                          <Select value={p.status} onValueChange={(v) => handleStatusChange(p.codigo, v, p.status)}>
                            <SelectTrigger className="w-[130px] h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Disponível">Disponível</SelectItem>
                              <SelectItem value="Reservado">Reservado</SelectItem>
                              <SelectItem value="Vendido">Vendido</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="icon" variant="ghost" onClick={() => handleDuplicate(p)} title="Duplicar">
                            <Copy />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => { setEditing(p); setDuplicating(null); setShowForm(true); }} title="Editar">
                            <Pencil />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(p.codigo)} title="Excluir">
                            <Trash2 />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="vendas">
            <SalesHistory onChange={() => setRefreshKey((k) => k + 1)} />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) { setEditing(null); setDuplicating(null); } }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Editar ${editing.codigo}` : duplicating ? `Duplicar de ${duplicating.codigo}` : "Novo produto"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editing}
            duplicateFrom={duplicating}
            onSaved={() => { setShowForm(false); setEditing(null); setDuplicating(null); loadProducts(); }}
            onCancel={() => { setShowForm(false); setEditing(null); setDuplicating(null); }}
          />
        </DialogContent>
      </Dialog>

      {saleProduct && (
        <SaleDialog
          open={!!saleProduct}
          onOpenChange={(o) => { if (!o) setSaleProduct(null); }}
          productCodigo={saleProduct.codigo}
          productNome={saleProduct.nome}
          defaultPrice={Number(saleProduct.preco_brl) || 0}
          onSaved={() => { setSaleProduct(null); loadProducts(); }}
        />
      )}

      <BulkActionsBar
        count={selected.size}
        onClear={() => setSelected(new Set())}
        onStatus={bulkStatus}
        onDuplicate={bulkDuplicate}
        onDelete={bulkDelete}
      />
    </main>
  );
}
