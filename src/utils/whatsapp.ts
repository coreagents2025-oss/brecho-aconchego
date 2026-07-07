import type { CartItem } from '@/contexts/CartContext';

const WA_NUMBER = '5541995299244';

export function generateWhatsAppLink(codigo: string, tamanho: string, productUrl: string): string {
  const message = `Oi! Vi essa peça no catálogo e me interessei 😍

📦 *Código:* ${codigo}
📏 *Tamanho:* ${tamanho}
🔗 *Link:* ${productUrl}

Ela ainda está disponível? Gostaria de saber mais detalhes! ✨`;

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateInterestWhatsAppLink(codigo: string, tamanho: string): string {
  const message = `Oi! Vi uma peça que me interessou muito no catálogo 🤍

📦 *Código:* ${codigo}
📏 *Tamanho:* ${tamanho}

Sei que ela está reservada, mas gostaria de demonstrar interesse caso ela fique disponível novamente. Vocês podem me avisar? 💕`;

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

function formatBRL(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

export function generateCartWhatsAppLink(items: CartItem[]): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://app.brechodavez.com.br';
  const lines = items
    .map((it, idx) => {
      const link = `${origin}/p/${it.codigo}`;
      return `${idx + 1}. *${it.nome}* — cód: ${it.codigo} — tam: ${it.tamanho} — ${formatBRL(it.preco_brl)}\n   🔗 ${link}`;
    })
    .join('\n\n');
  const total = items.reduce((s, i) => s + i.preco_brl, 0);
  const message = `Oi! Montei minha sacola no catálogo e quero levar essas peças 💛

${lines}

*Total:* ${formatBRL(total)}

As peças ainda estão disponíveis? ✨`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
