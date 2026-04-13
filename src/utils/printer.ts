// ESC/POS command constants
const ESC = '\x1B';
const GS = '\x1D';

const Commands = {
  INIT: ESC + '@',
  ALIGN_CENTER: ESC + 'a' + '1',
  ALIGN_LEFT: ESC + 'a' + '0',
  BOLD_ON: ESC + 'E' + '\x01',
  BOLD_OFF: ESC + 'E' + '\x00',
  SIZE_NORMAL: GS + '!' + '\x00',
  SIZE_DOUBLE: GS + '!' + '\x11',
  SIZE_LARGE: GS + '!' + '\x22',
  LINE_FEED: '\n',
  CUT_PAPER: GS + 'V' + '\x41' + '\x00',
  SEPARATOR: '--------------------------------\n',
};

// Common ESC/POS Bluetooth service / characteristic UUIDs
const PRINTER_SERVICE_UUID = '000018f0-0000-1000-8000-00805f9b34fb';
const PRINTER_CHAR_UUID = '00002af1-0000-1000-8000-00805f9b34fb';

interface PrinterConnection {
  device: BluetoothDevice;
  characteristic: BluetoothRemoteGATTCharacteristic;
}

let printerConnection: PrinterConnection | null = null;

export function isWebBluetoothAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
}

export function isPrinterConnected(): boolean {
  return printerConnection !== null && printerConnection.device.gatt?.connected === true;
}

export async function connectPrinter(): Promise<void> {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [PRINTER_SERVICE_UUID] }],
    optionalServices: [PRINTER_SERVICE_UUID],
  });

  if (!device.gatt) throw new Error('GATT not supported on this device');

  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(PRINTER_SERVICE_UUID);
  const characteristic = await service.getCharacteristic(PRINTER_CHAR_UUID);

  // Listen for disconnect events
  device.addEventListener('gattserverdisconnected', () => {
    printerConnection = null;
  });

  printerConnection = { device, characteristic };
}

export function disconnectPrinter(): void {
  if (printerConnection?.device.gatt?.connected) {
    printerConnection.device.gatt.disconnect();
  }
  printerConnection = null;
}

async function sendToPrinter(data: string): Promise<void> {
  if (!printerConnection) throw new Error('Stampante non connessa');

  const encoded = new TextEncoder().encode(data);
  const chunkSize = 512;

  for (let i = 0; i < encoded.length; i += chunkSize) {
    const chunk = encoded.slice(i, i + chunkSize);
    await printerConnection.characteristic.writeValue(chunk);
    // Small delay between chunks to avoid buffer overflow
    await new Promise<void>((resolve) => setTimeout(resolve, 50));
  }
}

export interface KitchenTicketData {
  orderId: string;
  items: Array<{ product: { name: string; category: string }; quantity: number }>;
  timestamp: Date;
  tableNumber?: string;
}

export interface CustomerReceiptData {
  orderId: string;
  items: Array<{ product: { name: string; price: number }; quantity: number }>;
  total: number;
  timestamp: Date;
  tableNumber?: string;
  customerName?: string;
}

const KITCHEN_CATEGORIES = ['pinse-rosse', 'pinse-bianche', 'pinse-fredde', 'taglieri', 'fritti'];

// ---------------------------------------------------------------------------
// Browser print fallback — both receipts in a single window.print() call
// ---------------------------------------------------------------------------

function buildKitchenHtml(data: KitchenTicketData): string {
  const kitchenItems = data.items.filter((item) =>
    KITCHEN_CATEGORIES.includes(item.product.category)
  );
  if (kitchenItems.length === 0) return '';

  const rows = kitchenItems
    .map((item) => `<div style="font-size:15px;font-weight:bold;">${item.quantity}x ${item.product.name}</div>`)
    .join('');
  const table = data.tableNumber ? `<div>Tavolo: <b>${data.tableNumber}</b></div>` : '';

  return `
    <h2 style="text-align:center;font-size:18px;margin:4px 0;">CUCINA</h2>
    <hr style="border:none;border-top:1px dashed #000;margin:6px 0;">
    <div>Ordine: <b>#${data.orderId}</b></div>
    <div>Ora: ${data.timestamp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</div>
    ${table}
    <hr style="border:none;border-top:1px dashed #000;margin:6px 0;">
    ${rows}
    <hr style="border:none;border-top:1px dashed #000;margin:6px 0;">
  `;
}

function buildCustomerHtml(data: CustomerReceiptData): string {
  const rows = data.items
    .map((item) => {
      const price = item.product.price === 0
        ? '---'
        : `\u20AC${(item.product.price * item.quantity).toFixed(2)}`;
      return `<div style="display:flex;justify-content:space-between;"><span>${item.quantity}x ${item.product.name}</span><span>${price}</span></div>`;
    })
    .join('');
  const table = data.tableNumber ? `<div>Tavolo: <b>${data.tableNumber}</b></div>` : '';
  const customer = data.customerName ? `<div>Cliente: <b>${data.customerName}</b></div>` : '';

  return `
    <h2 style="text-align:center;font-size:18px;margin:4px 0;">IL RISTORO</h2>
    <hr style="border:none;border-top:1px dashed #000;margin:6px 0;">
    <div>Ordine: <b>#${data.orderId}</b></div>
    <div>${data.timestamp.toLocaleDateString('it-IT')} ${data.timestamp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</div>
    ${table}${customer}
    <hr style="border:none;border-top:1px dashed #000;margin:6px 0;">
    ${rows}
    <hr style="border:none;border-top:1px dashed #000;margin:6px 0;">
    <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:15px;">
      <span>TOTALE</span><span>\u20AC${data.total.toFixed(2)}</span>
    </div>
    <hr style="border:none;border-top:1px dashed #000;margin:6px 0;">
    <div style="text-align:center;font-size:11px;margin-top:8px;">Grazie per la visita!</div>
  `;
}

/** Prints kitchen + customer in one window.print() call to avoid double dialogs */
export function browserPrintAll(kitchen: KitchenTicketData, customer: CustomerReceiptData): void {
  const frame = document.getElementById('print-frame');
  if (!frame) return;

  const kitchenHtml = buildKitchenHtml(kitchen);
  const customerHtml = buildCustomerHtml(customer);

  // Only add page-break if there's a kitchen section
  const combined = kitchenHtml
    ? `${kitchenHtml}<div style="page-break-after:always;"></div>${customerHtml}`
    : customerHtml;

  frame.innerHTML = combined;
  window.print();
  setTimeout(() => { frame.innerHTML = ''; }, 1000);
}

// ---------------------------------------------------------------------------
// ESC/POS print (Bluetooth — Android Chrome only)
// ---------------------------------------------------------------------------

export async function printKitchenTicket(data: KitchenTicketData): Promise<void> {
  console.log('[printer] printKitchenTicket (BT) called');
  if (!isPrinterConnected()) return; // browser fallback handled by browserPrintAll in App

  const kitchenItems = data.items.filter((item) =>
    KITCHEN_CATEGORIES.includes(item.product.category)
  );

  if (kitchenItems.length === 0) return;

  let receipt = Commands.INIT;

  receipt += Commands.ALIGN_CENTER;
  receipt += Commands.SIZE_LARGE;
  receipt += Commands.BOLD_ON;
  receipt += 'CUCINA\n';
  receipt += Commands.BOLD_OFF;
  receipt += Commands.SIZE_NORMAL;
  receipt += Commands.LINE_FEED;

  receipt += Commands.ALIGN_LEFT;
  receipt += Commands.SEPARATOR;
  receipt += `Ordine: #${data.orderId}\n`;
  receipt += `Ora: ${data.timestamp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}\n`;
  if (data.tableNumber) receipt += `Tavolo: ${data.tableNumber}\n`;
  receipt += Commands.SEPARATOR;
  receipt += Commands.LINE_FEED;

  receipt += Commands.SIZE_DOUBLE;
  for (const item of kitchenItems) {
    receipt += Commands.BOLD_ON;
    receipt += `${item.quantity}x ${item.product.name}\n`;
    receipt += Commands.BOLD_OFF;
  }
  receipt += Commands.SIZE_NORMAL;
  receipt += Commands.LINE_FEED;
  receipt += Commands.SEPARATOR;

  receipt += Commands.LINE_FEED;
  receipt += Commands.LINE_FEED;
  receipt += Commands.LINE_FEED;
  receipt += Commands.CUT_PAPER;

  await sendToPrinter(receipt);
}

export async function printCustomerReceipt(data: CustomerReceiptData): Promise<void> {
  console.log('[printer] printCustomerReceipt (BT) called');
  if (!isPrinterConnected()) return; // browser fallback handled by browserPrintAll in App

  let receipt = Commands.INIT;

  receipt += Commands.ALIGN_CENTER;
  receipt += Commands.SIZE_DOUBLE;
  receipt += Commands.BOLD_ON;
  receipt += 'IL RISTORO\n';
  receipt += Commands.BOLD_OFF;
  receipt += Commands.SIZE_NORMAL;
  receipt += Commands.LINE_FEED;

  receipt += Commands.ALIGN_LEFT;
  receipt += Commands.SEPARATOR;
  receipt += `Ordine: #${data.orderId}\n`;
  receipt += `Data: ${data.timestamp.toLocaleDateString('it-IT')}\n`;
  receipt += `Ora: ${data.timestamp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}\n`;
  if (data.tableNumber) receipt += `Tavolo: ${data.tableNumber}\n`;
  if (data.customerName) receipt += `Cliente: ${data.customerName}\n`;
  receipt += Commands.SEPARATOR;
  receipt += Commands.LINE_FEED;

  for (const item of data.items) {
    const line = `${item.quantity}x ${item.product.name}`;
    const price = item.product.price === 0 ? '---' : `\u20AC${(item.product.price * item.quantity).toFixed(2)}`;
    const padding = Math.max(1, 32 - line.length - price.length);
    receipt += `${line}${' '.repeat(padding)}${price}\n`;
  }

  receipt += Commands.SEPARATOR;
  receipt += Commands.LINE_FEED;

  receipt += Commands.SIZE_DOUBLE;
  receipt += Commands.BOLD_ON;
  const totalLabel = 'TOTALE:';
  const totalValue = `\u20AC${data.total.toFixed(2)}`;
  const totalPad = Math.max(1, 16 - totalLabel.length - totalValue.length);
  receipt += `${totalLabel}${' '.repeat(totalPad)}${totalValue}\n`;
  receipt += Commands.BOLD_OFF;
  receipt += Commands.SIZE_NORMAL;

  receipt += Commands.LINE_FEED;
  receipt += Commands.SEPARATOR;
  receipt += Commands.ALIGN_CENTER;
  receipt += 'Grazie per la visita!\n';
  receipt += Commands.LINE_FEED;
  receipt += Commands.LINE_FEED;
  receipt += Commands.LINE_FEED;
  receipt += Commands.CUT_PAPER;

  await sendToPrinter(receipt);
}

export function generateOrderId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = now.getTime().toString().slice(-4);
  return `${date}-${suffix}`;
}
