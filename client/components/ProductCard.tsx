import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import { Check, ShoppingCart } from 'lucide-react';
import { getEffectivePrice, hasDiscount, getDiscountPercentage } from '@/lib/product-utils';
import { STOCK_CONFIG, MESSAGES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='640' viewBox='0 0 640 640'%3E%3Crect width='640' height='640' fill='%23f3f4f6'/%3E%3Ctext x='320' y='320' text-anchor='middle' dominant-baseline='middle' fill='%236b7280' font-family='sans-serif' font-size='28'%3ENo image%3C/text%3E%3C/svg%3E";

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imageSrc, setImageSrc] = useState(product.image);
  const [justAdded, setJustAdded] = useState(false);
  const hasDiscountApplied = hasDiscount(product.price, product.sale_price);
  const discountPercentage = getDiscountPercentage(product.price, product.sale_price);
  const effectivePrice = getEffectivePrice(product.price, product.sale_price);
  const hasStock = product.quantity > 0;
  const isLowStock = hasStock && product.quantity <= STOCK_CONFIG.LOW_STOCK_THRESHOLD;

  const handleAddToCart = () => {
    if (!hasStock) {
      return;
    }

    onAddToCart();
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1300);
  };

  return (
    <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg">
      <div className="relative h-36 overflow-hidden bg-gray-100 sm:h-44 md:h-52 lg:h-40 xl:h-48">
        <Image
          src={imageSrc}
          alt={`${product.name} - Product image`}
          fill
          sizes="(max-width: 639px) 50vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, 20vw"
          quality={75}
          loading="lazy"
          placeholder="blur"
          blurDataURL={FALLBACK_IMAGE}
          onError={() => setImageSrc(FALLBACK_IMAGE)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gray-900/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {hasDiscountApplied && (
          <div className="absolute right-2 top-2 rounded-full bg-lime-400 px-2.5 py-1 text-[11px] font-bold text-gray-900 sm:right-3 sm:top-3 sm:text-xs">
            -{discountPercentage}%
          </div>
        )}
      </div>

      <div className="p-3 md:p-4 lg:p-3 xl:p-4">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="mb-1.5 line-clamp-2 text-sm font-semibold leading-snug text-gray-900 lg:text-xs xl:text-sm">{product.name}</h3>

            <div className="mb-1.5 flex items-center justify-between">
              <div>
                <p className="text-base font-bold leading-none text-gray-900 sm:text-lg lg:text-base xl:text-lg">{formatPrice(effectivePrice)}</p>
                {hasDiscountApplied && (
                  <p className="mt-1 text-[11px] text-gray-500 line-through sm:text-xs">{formatPrice(product.price)}</p>
                )}
              </div>
            </div>

            {isLowStock && (
              <p className="mb-1 text-[11px] font-semibold text-yellow-600 sm:text-xs lg:mb-0">{MESSAGES.FEW_UNITS_LEFT}</p>
            )}
            {!hasStock && (
              <p className="mb-1 text-[11px] font-medium text-red-500 sm:text-xs lg:mb-0">{MESSAGES.OUT_OF_STOCK}</p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!hasStock}
            aria-label="Add to Cart"
            className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 lg:flex xl:h-10 xl:w-10 ${justAdded ? 'border-lime-500 bg-lime-100 text-lime-700' : 'border-gray-300 bg-white text-gray-900 hover:border-lime-500 hover:text-lime-600'}`}
          >
            {justAdded ? <Check size={15} /> : <ShoppingCart size={15} />}
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!hasStock}
          className={`mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 lg:hidden ${justAdded ? 'border-lime-500 bg-lime-100 text-lime-700' : 'border-gray-300 bg-white text-gray-900 hover:border-lime-500 hover:text-lime-600'}`}
        >
          {justAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
          {justAdded ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
