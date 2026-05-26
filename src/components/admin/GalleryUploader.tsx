import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, GripVertical } from "lucide-react";
import { toast } from "sonner";

const BUCKET = "product-images";
const MAX = 4;
const SLOTS = ["capa", "galeria-1", "galeria-2", "galeria-3"];
const LABELS = ["Capa", "Galeria 1", "Galeria 2", "Galeria 3"];

interface Props {
  codigo: string;
  urls: string[]; // ordered: [capa, g1, g2, g3]
  onChange: (urls: string[]) => void;
}

export function GalleryUploader({ codigo, urls, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  async function handleFiles(files: FileList | File[]) {
    if (!codigo) {
      toast.error("Preencha o código do produto antes de enviar fotos");
      return;
    }
    const arr = Array.from(files).filter((f) => {
      if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(f.type)) {
        toast.error(`${f.name}: formato não suportado`);
        return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name}: maior que 5MB`);
        return false;
      }
      return true;
    });

    const current = [...urls];
    const free = MAX - current.filter(Boolean).length;
    if (free <= 0) {
      toast.error("Limite de 4 fotos atingido");
      return;
    }
    const toUpload = arr.slice(0, free);
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of toUpload) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${codigo}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
          upsert: true,
          contentType: file.type,
        });
        if (error) throw error;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      const filled = current.filter(Boolean);
      const next = [...filled, ...uploaded];
      while (next.length < MAX) next.push("");
      onChange(next);
      toast.success(`${uploaded.length} foto(s) enviada(s)`);
    } catch (e: any) {
      toast.error("Falha no upload: " + e.message);
    } finally {
      setUploading(false);
    }
  }

  function removeAt(idx: number) {
    const next = urls.filter((_, i) => i !== idx);
    while (next.length < MAX) next.push("");
    onChange(next);
  }

  function move(from: number, to: number) {
    if (from === to) return;
    const filled = urls.filter(Boolean);
    if (from >= filled.length || to >= filled.length) return;
    const next = [...filled];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    while (next.length < MAX) next.push("");
    onChange(next);
  }

  const filled = urls.filter(Boolean);

  return (
    <div className="space-y-3">
      <div
        className="border-2 border-dashed border-border rounded-2xl p-6 bg-muted/30 text-center"
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
      >
        <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-3">
          Arraste até {MAX} fotos aqui ou clique para selecionar (JPG/PNG/WEBP, máx 5MB)
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading || filled.length >= MAX}>
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
          Selecionar fotos
        </Button>
      </div>

      {filled.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {filled.map((url, idx) => (
            <div
              key={url + idx}
              draggable
              onDragStart={() => setDragIdx(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); if (dragIdx !== null) move(dragIdx, idx); setDragIdx(null); }}
              className={`relative group border border-border rounded-xl overflow-hidden bg-card ${dragIdx === idx ? "opacity-50" : ""}`}
            >
              <img src={url} alt={LABELS[idx]} className="w-full h-32 object-cover" />
              <div className="absolute top-1 left-1 bg-background/90 text-xs px-2 py-0.5 rounded-full font-medium">
                {LABELS[idx]}
              </div>
              <div className="absolute top-1 right-1 flex gap-1">
                <button type="button" className="bg-background/90 p-1 rounded-full cursor-grab" title="Arraste para reordenar">
                  <GripVertical className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => removeAt(idx)} className="bg-background/90 p-1 rounded-full">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">A primeira foto vira a capa. Arraste para reordenar.</p>
    </div>
  );
}

export { SLOTS };
