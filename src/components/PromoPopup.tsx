import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePopup } from "@/hooks/usePopup";

const STORAGE_KEY = "bdv_popup_seen";

function shouldShow(popupId: string, frequencia: string): boolean {
  try {
    if (frequencia === "sempre") return true;
    if (frequencia === "sessao") {
      return sessionStorage.getItem(STORAGE_KEY) !== popupId;
    }
    // dia
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const [seenId, ts] = raw.split("|");
    if (seenId !== popupId) return true;
    const ageMs = Date.now() - Number(ts || 0);
    return ageMs > 24 * 60 * 60 * 1000;
  } catch {
    return true;
  }
}

function markSeen(popupId: string, frequencia: string) {
  try {
    if (frequencia === "sessao") sessionStorage.setItem(STORAGE_KEY, popupId);
    else if (frequencia === "dia") localStorage.setItem(STORAGE_KEY, `${popupId}|${Date.now()}`);
  } catch {}
}

export function PromoPopup() {
  const { popup } = usePopup();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!popup) return;
    if (!shouldShow(popup.id, popup.frequencia || "sessao")) return;
    const t = setTimeout(() => {
      setOpen(true);
      markSeen(popup.id, popup.frequencia || "sessao");
    }, 1200);
    return () => clearTimeout(t);
  }, [popup]);

  if (!popup) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-2xl overflow-hidden p-0">
        {popup.imagem_url && (
          <img src={popup.imagem_url} alt={popup.titulo} className="w-full h-56 object-cover" />
        )}
        <div className="p-6 space-y-3 text-center">
          {popup.titulo && <h3 className="font-display text-2xl">{popup.titulo}</h3>}
          {popup.mensagem && <p className="text-muted-foreground font-body">{popup.mensagem}</p>}
          {popup.cta_texto && popup.cta_url && (
            <Button
              className="w-full mt-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => { window.open(popup.cta_url, "_blank"); setOpen(false); }}
            >
              {popup.cta_texto}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
