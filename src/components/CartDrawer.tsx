import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Trash2, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { generateCartWhatsAppLink } from '@/utils/whatsapp';
import { trackCartCheckout, trackWhatsAppClick } from '@/lib/tracking';

function formatPrice(price: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
}

export function CartDrawer() {
  const { items, isOpen, closeCart, remove, clear, total, count } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    const link = generateCartWhatsAppLink(items);
    trackCartCheckout(count);
    trackWhatsAppClick();
    window.open(link, '_blank');
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? null : closeCart())}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col bg-background">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Sua sacola {count > 0 && <span className="text-muted-foreground text-base font-body">({count})</span>}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="font-display text-lg text-foreground mb-1">Sua sacola está vazia</p>
              <p className="font-body text-sm text-muted-foreground">
                Adicione peças que gostou e envie tudo de uma vez pelo WhatsApp 💛
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.codigo} className="flex gap-3 bg-card rounded-2xl p-3 shadow-card">
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    {item.url_capa ? (
                      <img src={item.url_capa} alt={item.nome} className="w-full h-full object-cover" loading="lazy" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <p className="font-display text-base font-medium text-foreground line-clamp-1">{item.nome}</p>
                    <p className="font-body text-xs text-muted-foreground">
                      Cód: {item.codigo} · Tam: {item.tamanho}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-display font-medium text-foreground">{formatPrice(item.preco_brl)}</span>
                      <button
                        onClick={() => remove(item.codigo)}
                        className="text-muted-foreground hover:text-destructive transition-smooth p-1"
                        aria-label={`Remover ${item.nome} da sacola`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="flex-col gap-3 sm:flex-col border-t border-border pt-4">
            <div className="w-full flex items-center justify-between">
              <span className="font-body text-muted-foreground">Subtotal</span>
              <span className="font-display text-xl font-semibold text-foreground">{formatPrice(total)}</span>
            </div>
            <Button
              onClick={handleCheckout}
              size="lg"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-body font-medium shadow-hover transition-bounce"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Finalizar pelo WhatsApp
            </Button>
            <div className="w-full flex gap-2">
              <Button variant="ghost" onClick={closeCart} className="flex-1 font-body">
                Continuar comprando
              </Button>
              <Button variant="ghost" onClick={clear} className="font-body text-muted-foreground hover:text-destructive">
                Esvaziar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center font-body">
              A confirmação de disponibilidade e o pagamento acontecem pelo WhatsApp.
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
