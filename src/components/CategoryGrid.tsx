import { categories, categoryLabels } from '../data/products';
import type { Category } from '../types';

interface CategoryGridProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

export function CategoryGrid({ selectedCategory, onSelectCategory }: CategoryGridProps) {
  return (
    <div className="flex gap-2 px-4 py-3 bg-white border-b border-stone-200 overflow-x-auto shrink-0 scrollbar-none">
      {categories.map((cat) => {
        const isActive = cat === selectedCategory;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat as Category)}
            className={`
              shrink-0 px-5 py-2 rounded-xl font-semibold text-sm whitespace-nowrap
              transition-all duration-150 select-none
              ${isActive
                ? 'bg-[#7B2D34] text-white shadow-md scale-105'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 active:scale-95'
              }
            `}
            style={{ minHeight: 60 }}
          >
            {categoryLabels[cat]}
          </button>
        );
      })}
    </div>
  );
}
