import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useBanners, Banner } from "@/hooks/useBanners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, ArrowUp, ArrowDown, Upload } from "lucide-react";
import { toast } from "sonner";

const BUCKET = "product-images";

export function BannersManager() {
  const { banners, loading, reload } = useBanners(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [open, setOpen] = useState(false);

  async function toggleAtivo(b: Banner) {
    const { error } = await supabase.from("banners").update({ ativo: !b.ativo }).eq("id", b.id);
    if (error) toast.error(error.message); else reload();
  }

  async function remove(b: Banner) {
    if (!confirm(`Excluir banner "${b.titulo || "(sem título)"}"?`)) return;
    const { error } = await supabase.from("banners").delete().eq("id", b.id);
    if (error) toast.error(error.message); else { toast.success("Excluído"); reload(); }
  }

  async function reorder(idx: number, dir: -1 | 1) {
    const a = banners[idx]; const b = banners[idx + dir];
    if (!a || !b) return;
    await supabase.from("banners").update({ ordem: b.ordem }).eq("id", a.id);
    await supabase.from("banners").update({ ordem: a.ordem }).eq("id", b.id);
    reload();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display text-2xl">Banners do carrossel</h2>
          <p className="text-sm text-muted-foreground">Aparecem na home, em ordem.</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus /> Novo banner</Button>
      </div>

      {loading ? <Loader2 className="animate-spin mx-auto" /> : (
        <div className="grid gap-3">
          {banners.length === 0 && <p className="text-muted-foreground text-sm">Nenhum banner cadastrado.</p>}
          {banners.map((b, idx) => (
            <div key={b.id} className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-center">
              {b.imagem_url ? <img src={b.imagem_url} alt={b.titulo} className="w-32 h-20 object-cover rounded-xl" /> : <div className="w-32 h-20 bg-muted rounded-xl" />}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{b.titulo || "(sem título)"}</div>
                <div className="text-sm text-muted-foreground truncate">{b.subtitulo}</div>
                {b.link_url && <a href={b.link_url} target="_blank" rel="noreferrer" className="text-xs text-accent truncate block">{b.link_url}</a>}
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={b.ativo} onCheckedChange={() => toggleAtivo(b)} />
                <Button size="icon" variant="ghost" onClick={() => reorder(idx, -1)} disabled={idx === 0}><ArrowUp /></Button>
                <Button size="icon" variant="ghost" onClick={() => reorder(idx, 1)} disabled={idx === banners.length - 1}><ArrowDown /></Button>
                <Button size="icon" variant="ghost" onClick={() => { setEditing(b); setOpen(true); }}><Pencil /></Button>
                <Button size="icon" variant="ghost" onClick={() => remove(b)}><Trash2 /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{editing ? "Editar banner" : "Novo banner"}</DialogTitle></DialogHeader>
          <BannerForm banner={editing} onSaved={() => { setOpen(false); setEditing(null); reload(); }} onCancel={() => { setOpen(false); setEditing(null); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BannerForm({ banner, onSaved, onCancel }: { banner: Banner | null; onSaved: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    titulo: banner?.titulo || "",
    subtitulo: banner?.subtitulo || "",
    imagem_url: banner?.imagem_url || "",
    link_url: banner?.link_url || "",
    ordem: banner?.ordem ?? 0,
    ativo: banner?.ativo ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    if (file.size > 5 * 1024 * 1024) return toast.error("Maior que 5MB");
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `banners/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true, contentType: file.type });
    setUploading(false);
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    setForm((f) => ({ ...f, imagem_url: data.publicUrl }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, ordem: Number(form.ordem) || 0 };
    const { error } = banner
      ? await supabase.from("banners").update(payload).eq("id", banner.id)
      : await supabase.from("banners").insert(payload);
    setSaving(false);
    if (error) toast.error(error.message); else { toast.success("Salvo"); onSaved(); }
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div>
        <Label>Imagem</Label>
        {form.imagem_url && <img src={form.imagem_url} alt="" className="w-full h-40 object-cover rounded-xl mb-2" />}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />} {form.imagem_url ? "Trocar imagem" : "Enviar imagem"}
        </Button>
      </div>
      <div><Label>Título</Label><Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></div>
      <div><Label>Subtítulo</Label><Input value={form.subtitulo} onChange={(e) => setForm({ ...form, subtitulo: e.target.value })} /></div>
      <div><Label>Link (opcional)</Label><Input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="https://..." /></div>
      <div className="flex gap-4 items-end">
        <div className="flex-1"><Label>Ordem</Label><Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: Number(e.target.value) })} /></div>
        <div className="flex items-center gap-2 pb-2"><Switch checked={form.ativo} onCheckedChange={(v) => setForm({ ...form, ativo: v })} /><Label>Ativo</Label></div>
      </div>
      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={saving}>{saving && <Loader2 className="animate-spin" />}Salvar</Button>
      </div>
    </form>
  );
}
