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
  removeCategory: (category: string) => void;
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
  removeCategory: (category) => {
    set({
      selectedCategories: get().selectedCategories.filter((item) => item !== category),
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

const getEffectivePrice = (product: Product) =>
  product.sale_price > 0 ? product.sale_price : product.price;

const hasDiscount = (product: Product) =>
  product.sale_price > 0 && product.sale_price < product.price;

export const selectCategories = (state: ProductStoreState) => {
  return Array.from(new Set(state.products.map((product) => product.category))).sort();
};

export const selectFilteredProducts = (state: ProductStoreState) => {
  const query = state.searchQuery.trim().toLowerCase();

  const filtered = state.products.filter((product) => {
    const effectivePrice = getEffectivePrice(product);

    const categoryOk =
      state.selectedCategories.length === 0 ||
      state.selectedCategories.includes(product.category);

    const discountOk =
      state.selectedDiscount === 'all' ||
      (state.selectedDiscount === 'with' && hasDiscount(product)) ||
      (state.selectedDiscount === 'without' && !hasDiscount(product));

    const priceOk =
      effectivePrice >= state.priceRange[0] && effectivePrice <= state.priceRange[1];

    const searchOk =
      query.length === 0 ||
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.sub_category.toLowerCase().includes(query) ||
      product.tags.some((tag) => tag.toLowerCase().includes(query));

    return categoryOk && discountOk && priceOk && searchOk;
  });

  if (state.sortBy === 'highest-price') {
    return [...filtered].sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
  }

  if (state.sortBy === 'newest') {
    return [...filtered].reverse();
  }

  return [...filtered].sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
};