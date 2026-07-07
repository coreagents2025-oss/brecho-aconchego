import { Sparkles, Heart, Truck } from 'lucide-react';

const items = [
  { icon: Sparkles, title: 'Curadoria à mão', desc: 'Cada peça é escolhida com carinho e olhar feminino.' },
  { icon: Heart, title: 'Peças únicas', desc: 'Uma peça de cada — quando foi, foi. Achado é achado.' },
  { icon: Truck, title: 'Envio para todo Brasil', desc: 'Combinamos frete e pagamento pelo WhatsApp.' },
];

export function EditorialStrip() {
  return (
    <section className="border-y border-border/60 bg-card/40">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display text-lg text-foreground">{title}</p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
