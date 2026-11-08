import { useState, useEffect } from 'react';
import { reviewStats } from './data/reviewStats.js';

// useState that is saved to localStorage (used for cart and wishlist).
export function useStored(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable (private mode); the app still works without it.
    }
  }, [key, value]);

  return [value, setValue];
}

// 1599 -> "₹1,599" (null -> "—")
export const inr = (amount) =>
  amount == null ? '—' : '₹' + amount.toLocaleString('en-IN');

// Discount percentage between price and MRP.
export const off = (product) => {
  if (product.price == null || !product.mrp) return 0;
  return Math.round((1 - product.price / product.mrp) * 100);
};

// 17080 -> "17.1k", 273 -> "273"
export const fmtCount = (n) => {
  if (n < 1000) return String(n);
  return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
};

// Site-wide rating stats for a product id.
export const stat = (productId) => reviewStats[productId];
