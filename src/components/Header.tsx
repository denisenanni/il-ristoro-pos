import { useEffect, useState } from 'react';
import { PrinterStatus } from './PrinterStatus';

interface HeaderProps {
  orderCount: number;
}

export function Header({ orderCount }: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#7B2D34] text-white shadow-md shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold tracking-wide" style={{ fontFamily: 'Cinzel, serif' }}>
          Il Ristoro
        </span>
        <span className="text-sm opacity-70 font-medium uppercase tracking-widest">POS</span>
      </div>

      <div className="flex items-center gap-6">
        <PrinterStatus />

        <span className="text-lg font-mono tabular-nums opacity-90">
          {time.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>

        {orderCount > 0 && (
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-1">
            <span className="text-sm font-semibold">{orderCount} {orderCount === 1 ? 'articolo' : 'articoli'}</span>
          </div>
        )}
      </div>
    </header>
  );
}
