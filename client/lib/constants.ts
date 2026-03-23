export const SORT_OPTIONS = ['lowest-price', 'highest-price', 'newest'] as const;
export const DISCOUNT_OPTIONS = ['all', 'with', 'without'] as const;

export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,
  MAX_SUGGESTIONS: 6,
} as const;

export const HEADER_CONFIG = {
  SCROLL_THRESHOLD: 8,
} as const;

export const STOCK_CONFIG = {
  LOW_STOCK_THRESHOLD: 5,
} as const;

export const MESSAGES = {
  FEW_UNITS_LEFT: 'Few Units Left',
  OUT_OF_STOCK: 'Out of Stock',
  NO_PRODUCTS_FOUND: 'No products found',
  ADJUST_FILTERS: "Try adjusting your filters to find what you're looking for",
  NO_CLOSE_MATCHES: 'No close matches yet. Keep typing to refine the suggestions.',
  LOADING: 'Loading products...',
} as const;

export const VALIDATION_MESSAGES = {
  INVALID_MIN_PRICE: 'Minimum price must be a valid number.',
  INVALID_MAX_PRICE: 'Maximum price must be a valid number.',
  MIN_LESS_THAN_AVAILABLE: (amount: number) => `Minimum price is ₦${amount.toLocaleString()}.`,
  MAX_MORE_THAN_AVAILABLE: (amount: number) => `Maximum price is ₦${amount.toLocaleString()}.`,
  MIN_GREATER_THAN_MAX: 'Minimum price cannot be greater than maximum price.',
  MAX_LESS_THAN_MIN: 'Maximum price cannot be less than minimum price.',
} as const;
