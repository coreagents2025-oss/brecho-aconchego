import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { GalleryUploader } from "./GalleryUploader";
import { SaleDialog } from "./SaleDialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Product } from "@/types/product";

interface Props {
  product?: Product | null;
  duplicateFrom?: Product | null;
  onSaved: () => void;
  onCancel: () => void;
}

const emptyProduct = {
  codigo: "",
  categoria: "",
  nome: "",
  descricao: "",
  marca: "",
  tecido: "",
  medidas: "",
  cor: "",
  tamanho: "Único",
  tag: [] as string[],
  preco_brl: 0,
  condicao: "Usado",
  status: "Disponível" as Product["status"],
  url_capa: "",
  url_galeria_1: "",
  url_galeria_2: "",
  url_galeria_3: "",
  url_video: "",
};

export function ProductForm({ product, duplicateFrom, onSaved, onCancel }: Props) {
  const [form, setForm] = useState(emptyProduct);
  const [tagsText, setTagsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saleOpen, setSaleOpen] = useState(false);
  const initialStatus = product?.status ?? "Disponível";

  useEffect(() => {
    if (product) {
      setForm({ ...emptyProduct, ...product });
      setTagsText((product.tag || []).join(", "));
    } else if (duplicateFrom) {
      setForm({
        ...emptyProduct,
        ...duplicateFrom,
        codigo: `${duplicateFrom.codigo}-COPIA`,
        status: "Disponível",
      });
      setTagsText((duplicateFrom.tag || []).join(", "));
    } else {
      setForm(emptyProduct);
      setTagsText("");
    }
  }, [product, duplicateFrom]);

  const update = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const galleryUrls = [form.url_capa, form.url_galeria_1 || "", form.url_galeria_2 || "", form.url_galeria_3 || ""];

  function setGallery(urls: string[]) {
    setForm((f) => ({
      ...f,
      url_capa: urls[0] || "",
      url_galeria_1: urls[1] || "",
      url_galeria_2: urls[2] || "",
      url_galeria_3: urls[3] || "",
    }));
  }

  async function persist(payload: any) {
    const { error } = product
      ? await supabase.from("products").update(payload).eq("codigo", product.codigo)
      : await supabase.from("products").insert(payload);
    return error;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.codigo || !form.nome) {
      toast.error("Código e nome são obrigatórios");
      return;
    }
    // If switching to Vendido on existing product, open sale dialog instead of saving status directly
    if (product && form.status === "Vendido" && initialStatus !== "Vendido") {
      // Save all other fields first (keeping previous status), then open sale dialog
      setSaving(true);
      const payload = {
        ...form,
        status: initialStatus,
        tag: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
        preco_brl: Number(form.preco_brl) || 0,
      };
      const err = await persist(payload);
      setSaving(false);
      if (err) { toast.error("Erro: " + err.message); return; }
      setSaleOpen(true);
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      tag: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
      preco_brl: Number(form.preco_brl) || 0,
    };
    const err = await persist(payload);
    setSaving(false);
    if (err) toast.error("Erro ao salvar: " + err.message);
    else {
      toast.success(product ? "Produto atualizado" : "Produto criado");
      onSaved();
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Código *</Label>
          <Input value={form.codigo} onChange={(e) => update("codigo", e.target.value)} disabled={!!product} />
        </div>
        <div>
          <Label>Nome *</Label>
          <Input value={form.nome} onChange={(e) => update("nome", e.target.value)} />
        </div>
        <div>
          <Label>Categoria</Label>
          <Input value={form.categoria} onChange={(e) => update("categoria", e.target.value)} />
        </div>
        <div>
          <Label>Preço (R$)</Label>
          <Input type="number" step="0.01" value={form.preco_brl} onChange={(e) => update("preco_brl", e.target.value)} />
        </div>
        <div>
          <Label>Marca</Label>
          <Input value={form.marca} onChange={(e) => update("marca", e.target.value)} />
        </div>
        <div>
          <Label>Tamanho</Label>
          <Input value={form.tamanho} onChange={(e) => update("tamanho", e.target.value)} />
        </div>
        <div>
          <Label>Cor</Label>
          <Input value={form.cor} onChange={(e) => update("cor", e.target.value)} />
        </div>
        <div>
          <Label>Tecido</Label>
          <Input value={form.tecido} onChange={(e) => update("tecido", e.target.value)} />
        </div>
        <div>
          <Label>Condição</Label>
          <Input value={form.condicao} onChange={(e) => update("condicao", e.target.value)} />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => update("status", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Disponível">Disponível</SelectItem>
              <SelectItem value="Reservado">Reservado</SelectItem>
              <SelectItem value="Vendido">Vendido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Medidas</Label>
        <Input value={form.medidas} onChange={(e) => update("medidas", e.target.value)} />
      </div>

      <div>
        <Label>Descrição</Label>
        <Textarea rows={3} value={form.descricao} onChange={(e) => update("descricao", e.target.value)} />
      </div>

      <div>
        <Label>Tags (separadas por vírgula)</Label>
        <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="vintage, floral, verão" />
      </div>

      <div>
        <Label>URL do vídeo (YouTube / Instagram)</Label>
        <Input value={form.url_video} onChange={(e) => update("url_video", e.target.value)} placeholder="https://youtu.be/..." />
      </div>

      <div>
        <Label className="mb-2 block">Fotos (capa + galeria)</Label>
        <GalleryUploader codigo={form.codigo} urls={galleryUrls} onChange={setGallery} />
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="animate-spin" />}
          {product ? "Salvar alterações" : "Criar produto"}
        </Button>
      </div>
    </form>

    {product && (
      <SaleDialog
        open={saleOpen}
        onOpenChange={(o) => { setSaleOpen(o); if (!o) onSaved(); }}
        productCodigo={product.codigo}
        productNome={form.nome}
        defaultPrice={Number(form.preco_brl) || 0}
        onSaved={onSaved}
      />
    )}
    </>
  );
}
