import { useState, useCallback } from 'react';
import type { Order } from '../types';

const STORAGE_KEY = 'il-ristoro-pos-history';

function loadHistory(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

export function useOrderHistory() {
  const [history, setHistory] = useState<Order[]>(loadHistory);

  const saveOrder = useCallback((order: Order) => {
    setHistory((prev) => {
      const updated = [order, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, saveOrder, clearHistory };
}
