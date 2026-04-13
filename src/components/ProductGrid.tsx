import { memo, useCallback, useState } from 'react';
import { products } from '../data/products';
import { showToast } from '../utils/toast';
import type { Category, OrderItem, Product } from '../types';

interface ProductGridProps {
  category: Category;
  cartItems: OrderItem[];
  onAddItem: (product: Product) => void;
}

const ProductCard = memo(function ProductCard({
  product,
  cartQty,
  onAdd,
}: {
  product: Product;
  cartQty: number;
  onAdd: (product: Product) => void;
}) {
  const [flashing, setFlashing] = useState(false);

  const handleClick = useCallback(() => {
    onAdd(product);
    showToast(`${product.name} aggiunto`);
    setFlashing(true);
    setTimeout(() => setFlashing(false), 350);
  }, [product, onAdd]);

  return (
    <button
      onClick={handleClick}
      className={`
        relative flex flex-col justify-between
        min-h-[110px] w-full p-4 rounded-2xl
        border-2 shadow-sm text-left select-none
        transition-all duration-100 active:scale-95
        ${flashing
          ? 'item-added border-green-400'
          : 'bg-white border-transparent hover:border-[#7B2D34] hover:shadow-md'
        }
      `}
    >
      {/* Cart quantity badge */}
      {cartQty > 0 && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#7B2D34] text-white text-xs font-bold flex items-center justify-center">
          {cartQty}
        </div>
      )}

      <div className="pr-6">
        <span className="font-semibold text-stone-800 text-base leading-tight block">
          {product.name}
        </span>
        {product.description && (
          <span className="text-xs text-stone-500 leading-snug line-clamp-2 mt-0.5 block">
            {product.description}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className={`font-bold text-base ${product.price === 0 ? 'text-amber-600 text-xs' : 'text-[#7B2D34]'}`}>
          {product.price === 0 ? 'Prezzo da definire' : `€${product.price.toFixed(2).replace('.', ',')}`}
        </span>
        <div className="w-8 h-8 rounded-full bg-[#7B2D34] text-white flex items-center justify-center shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>
    </button>
  );
});

export function ProductGrid({ category, cartItems, onAddItem }: ProductGridProps) {
  const filtered = products.filter((p) => p.category === category);

  const cartQtyMap = cartItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.product.id] = item.quantity;
    return acc;
  }, {});

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            cartQty={cartQtyMap[product.id] ?? 0}
            onAdd={onAddItem}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex items-center justify-center h-40 text-stone-400 text-lg">
          Nessun prodotto in questa categoria
        </div>
      )}
    </div>
  );
}
