import { memo, useCallback, useEffect, useState } from 'react';
import { isPrinterConnected } from '../utils/printer';
import { showToast } from '../utils/toast';
import type { OrderItem } from '../types';

interface OrderCartProps {
  items: OrderItem[];
  total: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  onComplete: (tableNumber: string, customerName: string) => Promise<void>;
  onClose?: () => void;
  isMobile?: boolean;
}

const CartItem = memo(function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: OrderItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <li className="flex items-center gap-2 px-3 py-2.5">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-stone-800 text-sm leading-tight truncate">
          {item.product.name}
        </div>
        <div className="text-xs text-stone-400">
          {item.product.price === 0
            ? 'Prezzo da definire'
            : `€${item.product.price.toFixed(2).replace('.', ',')} cad.`}
        </div>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 active:scale-90 transition-all"
          aria-label="Diminuisci"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
          </svg>
        </button>
        <span className="w-7 text-center font-bold text-stone-800 tabular-nums text-sm">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#7B2D34] text-white hover:bg-[#6a2129] active:scale-90 transition-all"
          aria-label="Aumenta"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Line total */}
      <div className="w-14 text-right shrink-0">
        <span className="font-semibold text-[#7B2D34] text-sm">
          {item.product.price === 0
            ? '—'
            : `€${(item.product.price * item.quantity).toFixed(2).replace('.', ',')}`}
        </span>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.product.id)}
        className="ml-0.5 w-7 h-7 flex items-center justify-center text-stone-300 hover:text-red-400 transition-colors shrink-0 rounded"
        aria-label="Rimuovi"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </li>
  );
});

export function OrderCart({
  items,
  total,
  onUpdateQuantity,
  onRemove,
  onClear,
  onComplete,
  onClose,
  isMobile = false,
}: OrderCartProps) {
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [printing, setPrinting] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);

  const canComplete =
    items.length > 0 &&
    !printing &&
    (tableNumber.trim() !== '' || customerName.trim() !== '');

  const handleComplete = useCallback(async () => {
    if (!canComplete) return;
    setPrinting(true);
    setPrintError(null);
    try {
      await onComplete(tableNumber, customerName);
      setTableNumber('');
      setCustomerName('');
      showToast('Ordine completato');
      onClose?.();
    } catch (err) {
      setPrintError(err instanceof Error ? err.message : 'Errore stampa');
    } finally {
      setPrinting(false);
    }
  }, [canComplete, onComplete, tableNumber, customerName, onClose]);

  const handleClear = useCallback(() => {
    if (items.length >= 3) {
      if (!window.confirm(`Cancellare l'ordine con ${items.length} articoli?`)) return;
    }
    onClear();
    showToast('Ordine cancellato');
  }, [items.length, onClear]);

  // Keyboard shortcuts (desktop only)
  useEffect(() => {
    if (isMobile) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Enter' && canComplete) handleComplete();
      if (e.key === 'Escape' && items.length > 0) handleClear();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobile, canComplete, handleComplete, handleClear, items.length]);

  const content = (
    <>
      {/* Table / customer inputs */}
      <div className="px-4 py-3 space-y-2 border-b border-stone-100 shrink-0">
        <input
          type="text"
          placeholder="N. tavolo *"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#7B2D34] transition-colors"
        />
        <input
          type="text"
          placeholder="Nome cliente *"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#7B2D34] transition-colors"
        />
        <p className="text-xs text-stone-400">* Almeno uno dei due è obbligatorio</p>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-stone-400 p-8 text-center">
            <span className="text-4xl">🛒</span>
            <span className="text-sm">Aggiungi prodotti dall'elenco</span>
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Total + actions */}
      <div className="border-t border-stone-200 p-4 shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-stone-600 font-medium">Totale</span>
          <span className="text-2xl font-bold text-stone-900">
            €{total.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {!isPrinterConnected() && items.length > 0 && (
          <p className="text-xs text-stone-400 text-center">
            Nessuna stampante — verrà usata la stampa del browser
          </p>
        )}

        {printError && (
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-red-500">{printError}</p>
            <button
              onClick={handleComplete}
              className="text-xs font-semibold text-[#7B2D34] underline shrink-0"
            >
              Riprova
            </button>
          </div>
        )}

        <button
          onClick={handleComplete}
          disabled={!canComplete}
          className="
            w-full py-4 rounded-2xl font-bold text-lg text-white
            bg-[#7B2D34] hover:bg-[#6a2129] active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
            transition-all duration-150 shadow-md
          "
        >
          {printing ? 'Stampa in corso...' : 'Completa Ordine'}
        </button>
      </div>
    </>
  );

  // Mobile: full-screen slide-over from bottom
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
        {/* Panel */}
        <div className="fixed inset-x-0 bottom-0 top-16 z-50 flex flex-col bg-white rounded-t-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 shrink-0">
            <h2 className="font-bold text-stone-800 text-lg">Ordine</h2>
            <div className="flex items-center gap-3">
              {items.length > 0 && (
                <button
                  onClick={handleClear}
                  className="text-sm text-stone-400 hover:text-red-500 transition-colors"
                >
                  Cancella tutto
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors text-stone-500"
                aria-label="Chiudi"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          {content}
        </div>
      </>
    );
  }

  // Desktop: fixed sidebar
  return (
    <div className="w-[30%] min-w-[260px] max-w-[360px] flex flex-col bg-white border-l border-stone-200 shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 shrink-0">
        <h2 className="font-bold text-stone-800 text-lg">Ordine</h2>
        {items.length > 0 && (
          <button
            onClick={handleClear}
            className="text-sm text-stone-400 hover:text-red-500 transition-colors px-2 py-1 rounded"
          >
            Cancella tutto
          </button>
        )}
      </div>
      {content}
    </div>
  );
}
