import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productCodigo: string;
  productNome?: string;
  defaultPrice?: number;
  onSaved: () => void;
}

const CHANNELS = ["WhatsApp", "Instagram", "Presencial", "Outro"];

export function SaleDialog({ open, onOpenChange, productCodigo, productNome, defaultPrice = 0, onSaved }: Props) {
  const [channel, setChannel] = useState("WhatsApp");
  const [finalPrice, setFinalPrice] = useState<string>(String(defaultPrice));
  const [buyerName, setBuyerName] = useState("");
  const [buyerContact, setBuyerContact] = useState("");
  const [notes, setNotes] = useState("");
  const [soldAt, setSoldAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setChannel("WhatsApp");
      setFinalPrice(String(defaultPrice || 0));
      setBuyerName("");
      setBuyerContact("");
      setNotes("");
      setSoldAt(new Date().toISOString().slice(0, 10));
    }
  }, [open, defaultPrice]);

  async function handleConfirm() {
    setSaving(true);
    const { error: saleErr } = await supabase.from("sales").insert({
      product_codigo: productCodigo,
      channel,
      final_price: Number(finalPrice) || 0,
      buyer_name: buyerName,
      buyer_contact: buyerContact,
      notes,
      sold_at: new Date(soldAt + "T12:00:00").toISOString(),
    });
    if (saleErr) {
      setSaving(false);
      toast.error("Erro ao registrar venda: " + saleErr.message);
      return;
    }
    const { error: prodErr } = await supabase
      .from("products")
      .update({ status: "Vendido" })
      .eq("codigo", productCodigo);
    setSaving(false);
    if (prodErr) {
      toast.error("Venda salva, mas falha ao atualizar status: " + prodErr.message);
    } else {
      toast.success("Venda registrada");
    }
    onOpenChange(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            Registrar venda
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {productCodigo} {productNome ? `· ${productNome}` : ""}
          </p>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Data da venda</Label>
            <Input type="date" value={soldAt} onChange={(e) => setSoldAt(e.target.value)} />
          </div>
          <div>
            <Label>Canal</Label>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CHANNELS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Valor final (R$)</Label>
            <Input type="number" step="0.01" value={finalPrice} onChange={(e) => setFinalPrice(e.target.value)} />
          </div>
          <div>
            <Label>Comprador (opcional)</Label>
            <Input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
          </div>
          <div>
            <Label>Contato (opcional)</Label>
            <Input value={buyerContact} onChange={(e) => setBuyerContact(e.target.value)} placeholder="WhatsApp, @insta…" />
          </div>
          <div className="col-span-2">
            <Label>Observações</Label>
            <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={saving}>
            {saving && <Loader2 className="animate-spin" />}
            Confirmar venda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
