export type DiscountFilterOption = 'all' | 'with' | 'without';

export interface SidebarFiltersProps {
  categories: string[];
  selectedCategories: string[];
  selectedDiscount: DiscountFilterOption;
  priceRange: [number, number];
  defaultPriceRange: [number, number];
  availablePriceRange: [number, number];
  onCategoryChange: (category: string, checked: boolean) => void;
  onDiscountChange: (discount: DiscountFilterOption) => void;
  onPriceChange: (min: number, max: number) => void;
  onClearAll: () => void;
  onClose?: () => void;
}
