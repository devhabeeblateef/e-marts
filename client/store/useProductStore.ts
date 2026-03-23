import { create } from 'zustand';
import productsData from '@/data/products.json';
import { Product } from '@/types/product';

export type DiscountFilter = 'all' | 'with' | 'without';
export type SortOption = 'lowest-price' | 'highest-price' | 'newest';

interface ProductStoreState {
  products: Product[];
  selectedCategories: string[];
  selectedDiscount: DiscountFilter;
  priceRange: [number, number];
  defaultPriceRange: [number, number];
  sortBy: SortOption;
  searchQuery: string;
  cartCount: number;
  isSortOpen: boolean;
  isMobileFiltersOpen: boolean;
  toggleCategory: (category: string, checked: boolean) => void;
  setDiscount: (discount: DiscountFilter) => void;
  setPriceRange: (min: number, max: number) => void;
  setSortBy: (sortBy: SortOption) => void;
  setSearchQuery: (query: string) => void;
  setIsSortOpen: (open: boolean) => void;
  setIsMobileFiltersOpen: (open: boolean) => void;
  clearAllFilters: () => void;
  addToCart: () => void;
}

const normalizedProducts: Product[] = (productsData as Product[]).map((product) => ({
  ...product,
  sale_price: product.sale_price ?? 0,
  quantity: product.quantity ?? 0,
  in_stock: product.in_stock ?? (product.quantity ?? 0) > 0,
}));

const prices = normalizedProducts.map((product) =>
  product.sale_price > 0 ? product.sale_price : product.price
);
const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

export const useProductStore = create<ProductStoreState>((set, get) => ({
  products: normalizedProducts,
  selectedCategories: [],
  selectedDiscount: 'all',
  priceRange: [minPrice, maxPrice],
  defaultPriceRange: [minPrice, maxPrice],
  sortBy: 'lowest-price',
  searchQuery: '',
  cartCount: 0,
  isSortOpen: false,
  isMobileFiltersOpen: false,
  toggleCategory: (category, checked) => {
    const current = get().selectedCategories;
    set({
      selectedCategories: checked
        ? Array.from(new Set([...current, category]))
        : current.filter((item) => item !== category),
    });
  },
  setDiscount: (selectedDiscount) => set({ selectedDiscount }),
  setPriceRange: (min, max) => {
    const [defaultMin, defaultMax] = get().defaultPriceRange;
    const safeMin = Number.isFinite(min) ? Math.max(defaultMin, min) : defaultMin;
    const safeMax = Number.isFinite(max) ? Math.min(defaultMax, max) : defaultMax;
    set({
      priceRange: safeMin <= safeMax ? [safeMin, safeMax] : [safeMax, safeMin],
    });
  },
  setSortBy: (sortBy) => set({ sortBy }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setIsSortOpen: (isSortOpen) => set({ isSortOpen }),
  setIsMobileFiltersOpen: (isMobileFiltersOpen) => set({ isMobileFiltersOpen }),
  clearAllFilters: () => {
    const [defaultMin, defaultMax] = get().defaultPriceRange;
    set({
      selectedCategories: [],
      selectedDiscount: 'all',
      priceRange: [defaultMin, defaultMax],
      searchQuery: '',
    });
  },
  addToCart: () => set({ cartCount: get().cartCount + 1 }),
}));

