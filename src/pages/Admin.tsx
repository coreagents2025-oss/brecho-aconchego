import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ProductForm } from "@/components/admin/ProductForm";
import { Product } from "@/types/product";
import { Loader2, Plus, Pencil, Trash2, Download, LogOut, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [importing, setImporting] = useState(false);

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
  }

  async function handleDelete(codigo: string) {
    if (!confirm(`Excluir produto ${codigo}?`)) return;
    const { error } = await supabase.from("products").delete().eq("codigo", codigo);
    if (error) toast.error("Erro: " + error.message);
    else {
      toast.success("Produto excluído");
      loadProducts();
    }
  }

  async function handleStatusChange(codigo: string, status: string) {
    const { error } = await supabase.from("products").update({ status }).eq("codigo", codigo);
    if (error) toast.error("Erro: " + error.message);
    else {
      toast.success("Status atualizado");
      loadProducts();
    }
  }

  async function handleImport() {
    if (!confirm("Importar todos os produtos do catálogo do VPS? Produtos existentes (mesmo código) serão atualizados.")) return;
    setImporting(true);
    const { data, error } = await supabase.functions.invoke("import-catalog");
    setImporting(false);
    if (error) toast.error("Erro: " + error.message);
    else {
      toast.success(`Importação concluída: ${data?.imported ?? 0} produtos`);
      loadProducts();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const filtered = products.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
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

      <div className="container mx-auto px-6 py-6 space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Buscar por código, nome ou categoria…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="Disponível">Disponível</SelectItem>
              <SelectItem value="Reservado">Reservado</SelectItem>
              <SelectItem value="Vendido">Vendido</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleImport} disabled={importing}>
            {importing ? <Loader2 className="animate-spin" /> : <Download />}
            Importar catálogo do VPS
          </Button>
          <Button onClick={() => { setEditing(null); setShowForm(true); }}>
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
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhum produto</TableCell></TableRow>
                )}
                {filtered.map((p) => (
                  <TableRow key={p.codigo}>
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
                      <Select value={p.status} onValueChange={(v) => handleStatusChange(p.codigo, v)}>
                        <SelectTrigger className="w-[130px] h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Disponível">Disponível</SelectItem>
                          <SelectItem value="Reservado">Reservado</SelectItem>
                          <SelectItem value="Vendido">Vendido</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" onClick={() => { setEditing(p); setShowForm(true); }}>
                        <Pencil />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(p.codigo)}>
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

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? `Editar ${editing.codigo}` : "Novo produto"}</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editing}
            onSaved={() => { setShowForm(false); loadProducts(); }}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
