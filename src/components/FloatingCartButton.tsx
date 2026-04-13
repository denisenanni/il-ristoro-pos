interface FloatingCartButtonProps {
  itemCount: number;
  total: number;
  onClick: () => void;
}

export function FloatingCartButton({ itemCount, total, onClick }: FloatingCartButtonProps) {
  if (itemCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className="
        lg:hidden fixed bottom-5 right-4 z-40
        bg-[#7B2D34] text-white
        pl-5 pr-6 py-4 rounded-full shadow-xl
        flex items-center gap-3
        hover:bg-[#6a2129] active:scale-95
        transition-all duration-150
      "
    >
      {/* Cart icon + count */}
      <div className="relative">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-[#7B2D34] text-xs font-bold rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      </div>

      <span className="text-lg font-bold tabular-nums">
        €{total.toFixed(2).replace('.', ',')}
      </span>
    </button>
  );
}
