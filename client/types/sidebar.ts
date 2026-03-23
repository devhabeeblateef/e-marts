interface SidebarFiltersProps {
  categories: string[];
  selectedCategories: string[];
  selectedDiscount: string;
  priceRange: [number, number];
  defaultPriceRange: [number, number];
  availablePriceRange: [number, number];
  onCategoryChange: (category: string, checked: boolean) => void;
  onDiscountChange: (discount: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onClearAll: () => void;
  onClose?: () => void;
}
