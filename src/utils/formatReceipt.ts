import type { Order, Receipt } from '../types';

const KITCHEN_CATEGORIES = ['pinse-rosse', 'pinse-bianche', 'pinse-fredde', 'taglieri', 'fritti'];

export function buildKitchenReceipt(order: Order): Receipt {
  return {
    type: 'kitchen',
    order,
    items: order.items.filter((item) =>
      KITCHEN_CATEGORIES.includes(item.product.category)
    ),
  };
}

export function buildCustomerReceipt(order: Order): Receipt {
  return {
    type: 'customer',
    order,
    items: order.items,
  };
}

export function formatPrice(price: number): string {
  if (price === 0) return 'Prezzo da definire';
  return `€${price.toFixed(2).replace('.', ',')}`;
}

export function formatReceiptText(receipt: Receipt): string {
  const { type, order } = receipt;
  const lines: string[] = [];

  lines.push('================================');
  lines.push('        IL RISTORO');
  lines.push('================================');
  lines.push(`Ordine #${order.id}`);
  lines.push(`Data: ${new Date(order.timestamp).toLocaleString('it-IT')}`);
  if (order.tableNumber) lines.push(`Tavolo: ${order.tableNumber}`);
  if (order.customerName) lines.push(`Cliente: ${order.customerName}`);
  lines.push('--------------------------------');

  for (const item of receipt.items) {
    const name = item.product.name.padEnd(20);
    const qty = `x${item.quantity}`.padStart(3);
    if (type === 'customer') {
      const lineTotal = formatPrice(item.product.price * item.quantity);
      lines.push(`${name} ${qty}  ${lineTotal}`);
    } else {
      lines.push(`${name} ${qty}`);
    }
  }

  if (type === 'customer') {
    lines.push('================================');
    lines.push(`TOTALE: ${formatPrice(order.total)}`);
  }

  lines.push('================================');
  return lines.join('\n');
}
