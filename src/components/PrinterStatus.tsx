import { useState, useEffect } from 'react';
import { connectPrinter, disconnectPrinter, isPrinterConnected } from '../utils/printer';

export function PrinterStatus() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [bluetoothUsable, setBluetoothUsable] = useState<boolean | null>(null);

  useEffect(() => {
    setConnected(isPrinterConnected());

    if (!('bluetooth' in navigator)) {
      setBluetoothUsable(false);
      return;
    }
    // getAvailability() throws "Web Bluetooth API globally disabled" when the
    // feature is disabled at the browser/platform level — catch that as unusable
    navigator.bluetooth.getAvailability()
      .then((available) => setBluetoothUsable(available))
      .catch(() => setBluetoothUsable(false));
  }, []);

  // Still probing
  if (bluetoothUsable === null) return null;

  // Bluetooth not available on this platform/browser → silent "browser print" badge
  if (!bluetoothUsable) {
    return (
      <div className="flex items-center gap-1.5 text-white/50 text-xs">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Stampa browser
      </div>
    );
  }

  // Bluetooth available — show connect/disconnect controls
  if (connected) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-green-300">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">Stampante connessa</span>
        </div>
        <button
          onClick={() => { disconnectPrinter(); setConnected(false); }}
          className="text-xs text-white/50 hover:text-white/80 transition-colors underline"
        >
          Disconnetti
        </button>
      </div>
    );
  }

  async function handleConnect() {
    setConnecting(true);
    try {
      await connectPrinter();
      setConnected(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.toLowerCase().includes('cancel') && !msg.toLowerCase().includes('user')) {
        console.error('Printer connection error:', msg);
      }
    } finally {
      setConnecting(false);
    }
  }

  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      className="flex items-center gap-2 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
    >
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      {connecting ? 'Connessione...' : 'Connetti Stampante'}
    </button>
  );
}
