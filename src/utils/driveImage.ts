/**
 * Utility to convert Google Drive file ID to direct image URL
 */
export function driveImageUrl(fileId?: string): string {
  if (!fileId) {
    return '/placeholder.svg';
  }
  
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

/**
 * Format price in Brazilian Real
 */
export function formatPrice(price: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

/**
 * Generate WhatsApp deeplink with pre-filled message
 */
export function generateWhatsAppLink(
  codigo: string,
  tamanho: string,
  productUrl: string,
  phoneNumber: string = import.meta.env.VITE_WA_NUMBER || '5541995299244'
): string {
  const message = `Olá! Eu amei a peça ${codigo} (tamanho ${tamanho}) 💛\nAinda está disponível?\nLink: ${productUrl}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

/**
 * Generate interest WhatsApp link for reserved items
 */
export function generateInterestWhatsAppLink(
  codigo: string,
  tamanho: string,
  phoneNumber: string = import.meta.env.VITE_WA_NUMBER || '5541995299244'
): string {
  const message = `Oi! Gostaria de saber quando a peça ${codigo} (tamanho ${tamanho}) ficar disponível 🤍\nPode me avisar?`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}