import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePopup } from "@/hooks/usePopup";

const SESSION_KEY = "bdv_popup_seen";

export function PromoPopup() {
  const { popup } = usePopup();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!popup) return;
    try {
      const seen = sessionStorage.getItem(SESSION_KEY);
      if (seen === popup.id) return;
      const t = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem(SESSION_KEY, popup.id);
      }, 1200);
      return () => clearTimeout(t);
    } catch {}
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
