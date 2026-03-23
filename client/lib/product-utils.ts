import { Product } from '@/types/product';

export const getEffectivePrice = (price: number, salePrice: number): number => {
  return salePrice > 0 ? salePrice : price;
};

export const hasDiscount = (price: number, salePrice: number): boolean => {
  return salePrice > 0 && salePrice < price;
};

export const getDiscountPercentage = (price: number, salePrice: number): number => {
  if (!hasDiscount(price, salePrice)) return 0;
  return Math.round(((price - salePrice) / price) * 100);
};

export const searchScoring = (
  productName: string,
  category: string,
  subCategory: string,
  vendor: string,
  tags: string[],
  query: string
): number => {
  let score = 0;

  if (productName === query) {
    score += 100;
  } else if (productName.startsWith(query)) {
    score += 60;
  } else if (productName.includes(query)) {
    score += 40;
  }

  if (category.startsWith(query) || subCategory.startsWith(query)) {
    score += 25;
  } else if (category.includes(query) || subCategory.includes(query)) {
    score += 15;
  }

  if (vendor.includes(query)) {
    score += 10;
  }

  if (tags.some((tag) => tag.toLowerCase().includes(query))) {
    score += 12;
  }

  return score;
};
