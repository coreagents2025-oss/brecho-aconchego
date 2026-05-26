import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

const BUCKET = "product-images";

export function PopupManager() {
  const [id, setId] = useState<string | null>(null);
  const [form, setForm] = useState({
    titulo: "", mensagem: "", imagem_url: "", cta_texto: "", cta_url: "", ativo: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("popup").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle();
    if (data) {
      setId(data.id);
      setForm({
        titulo: data.titulo || "", mensagem: data.mensagem || "", imagem_url: data.imagem_url || "",
        cta_texto: data.cta_texto || "", cta_url: data.cta_url || "", ativo: !!data.ativo,
      });
    }
    setLoading(false);
  }

  async function handleUpload(file: File) {
    if (file.size > 5 * 1024 * 1024) return toast.error("Maior que 5MB");
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `popup/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true, contentType: file.type });
    setUploading(false);
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    setForm((f) => ({ ...f, imagem_url: data.publicUrl }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = id
      ? await supabase.from("popup").update(form).eq("id", id)
      : await supabase.from("popup").insert(form);
    setSaving(false);
    if (error) toast.error(error.message); else { toast.success("Salvo"); load(); }
  }

  if (loading) return <Loader2 className="animate-spin mx-auto" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form onSubmit={save} className="space-y-4">
        <div>
          <h2 className="font-display text-2xl">Popup promocional</h2>
          <p className="text-sm text-muted-foreground">Aparece 1x por sessão na home.</p>
        </div>
        <div>
          <Label>Imagem</Label>
          {form.imagem_url && <img src={form.imagem_url} alt="" className="w-full h-40 object-cover rounded-xl mb-2" />}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="animate-spin" /> : <Upload />} {form.imagem_url ? "Trocar" : "Enviar"} imagem
          </Button>
        </div>
        <div><Label>Título</Label><Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></div>
        <div><Label>Mensagem</Label><Textarea rows={3} value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Texto do botão</Label><Input value={form.cta_texto} onChange={(e) => setForm({ ...form, cta_texto: e.target.value })} placeholder="Ver coleção" /></div>
          <div><Label>Link do botão</Label><Input value={form.cta_url} onChange={(e) => setForm({ ...form, cta_url: e.target.value })} placeholder="https://..." /></div>
        </div>
        <div className="flex items-center gap-2"><Switch checked={form.ativo} onCheckedChange={(v) => setForm({ ...form, ativo: v })} /><Label>Ativo</Label></div>
        <Button type="submit" disabled={saving}>{saving && <Loader2 className="animate-spin" />}Salvar</Button>
      </form>

      <Card className="rounded-2xl">
        <CardContent className="p-0 overflow-hidden">
          <div className="bg-muted/30 p-4 text-xs text-muted-foreground border-b">Pré-visualização</div>
          <div className="p-6 bg-card">
            {form.imagem_url && <img src={form.imagem_url} alt="" className="w-full h-44 object-cover rounded-xl mb-4" />}
            {form.titulo && <h3 className="font-display text-2xl text-center mb-2">{form.titulo}</h3>}
            {form.mensagem && <p className="text-muted-foreground font-body text-center mb-4">{form.mensagem}</p>}
            {form.cta_texto && <Button className="w-full bg-accent text-accent-foreground" disabled>{form.cta_texto}</Button>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
