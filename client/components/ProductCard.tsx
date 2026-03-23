import Image from "next/image";
import {Product} from "@/types/product";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps){
  const hasDiscount = product.sale_price > 0 && product.sale_price < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;
  const effectivePrice = hasDiscount ? product.sale_price : product.price;
  const hasStock = product.quantity > 0;
  const isLowStock = hasStock && product.quantity <= 5;

  return (
    <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg">
      <div className="relative h-36 overflow-hidden bg-gray-100 sm:h-44 md:h-52 lg:h-40 xl:h-48">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, 20vw"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gray-900/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {hasDiscount && (
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
                <p className="text-base font-bold leading-none text-gray-900 sm:text-lg lg:text-base xl:text-lg">₦{effectivePrice.toLocaleString()}</p>
                {hasDiscount && (
                  <p className="mt-1 text-[11px] text-gray-500 line-through sm:text-xs">₦{product.price.toLocaleString()}</p>
                )}
              </div>
            </div>

            {isLowStock && (
              <p className="mb-1 text-[11px] font-semibold text-yellow-600 sm:text-xs lg:mb-0">Few Units Left</p>
            )}
            {!hasStock && (
              <p className="mb-1 text-[11px] font-medium text-red-500 sm:text-xs lg:mb-0">Out of Stock</p>
            )}
          </div>

          <button
            onClick={onAddToCart}
            disabled={!hasStock}
            aria-label="Add to Cart"
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-900 transition-colors hover:border-lime-500 hover:text-lime-600 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 lg:flex xl:h-10 xl:w-10"
          >
            <ShoppingCart size={15} />
          </button>
        </div>

        <button
          onClick={onAddToCart}
          disabled={!hasStock}
          className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 transition-colors hover:border-lime-500 hover:text-lime-600 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 lg:hidden"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
