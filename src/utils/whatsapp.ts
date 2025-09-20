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