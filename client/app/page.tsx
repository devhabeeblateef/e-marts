'use client';

import { useMemo } from 'react';
import { Header } from '@/components/Header';
import { SidebarFilters } from '@/components/SidebarFilters';
import ProductCard from '@/components/ProductCard';
import { Breadcrumb } from '@/components/BreadCrumb';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

// Zustand Store
import { useProductStore } from '@/store/useProductStore';


export default function Home() {
  const products = useProductStore((state) => state.products);
  const selectedCategories = useProductStore((state) => state.selectedCategories);
  const selectedDiscount = useProductStore((state) => state.selectedDiscount);
  const priceRange = useProductStore((state) => state.priceRange);
  const defaultPriceRange = useProductStore((state) => state.defaultPriceRange);
  const sortBy = useProductStore((state) => state.sortBy);
  const searchQuery = useProductStore((state) => state.searchQuery);
  const cartCount = useProductStore((state) => state.cartCount);
  const isSortOpen = useProductStore((state) => state.isSortOpen);
  const isMobileFiltersOpen = useProductStore((state) => state.isMobileFiltersOpen);


  const setSortBy = useProductStore((state) => state.setSortBy);
  const setIsSortOpen = useProductStore((state) => state.setIsSortOpen);
  const setIsMobileFiltersOpen = useProductStore((state) => state.setIsMobileFiltersOpen);
  const setSearchQuery = useProductStore((state) => state.setSearchQuery);
  const toggleCategory = useProductStore((state) => state.toggleCategory);
  const setDiscount = useProductStore((state) => state.setDiscount);
  const setPriceRange = useProductStore((state) => state.setPriceRange);
  const clearAllFilters = useProductStore((state) => state.clearAllFilters);
  const addToCart = useProductStore((state) => state.addToCart);


  const categories = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.category))).sort();
  }, [products]);

  const availablePriceRange = useMemo<[number, number]>(() => {
    const query = searchQuery.trim().toLowerCase();

    const getEffectivePrice = (price: number, salePrice: number) =>
      salePrice > 0 ? salePrice : price;

    const hasDiscount = (price: number, salePrice: number) =>
      salePrice > 0 && salePrice < price;

    const productsMatchingOtherFilters = products.filter((product) => {
      const categoryOk =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);

      const discountOk =
        selectedDiscount === 'all' ||
        (selectedDiscount === 'with' && hasDiscount(product.price, product.sale_price)) ||
        (selectedDiscount === 'without' && !hasDiscount(product.price, product.sale_price));

      const searchOk =
        query.length === 0 ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.sub_category.toLowerCase().includes(query) ||
        product.tags.some((tag) => tag.toLowerCase().includes(query));

      return categoryOk && discountOk && searchOk;
    });

    if (productsMatchingOtherFilters.length === 0) {
      return defaultPriceRange;
    }

    const effectivePrices = productsMatchingOtherFilters.map((product) =>
      getEffectivePrice(product.price, product.sale_price)
    );

    return [Math.min(...effectivePrices), Math.max(...effectivePrices)];
  }, [defaultPriceRange, products, searchQuery, selectedCategories, selectedDiscount]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const getEffectivePrice = (price: number, salePrice: number) =>
      salePrice > 0 ? salePrice : price;

    const hasDiscount = (price: number, salePrice: number) =>
      salePrice > 0 && salePrice < price;

    const filtered = products.filter((product) => {
      const effectivePrice = getEffectivePrice(product.price, product.sale_price);

      const categoryOk =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);

      const discountOk =
        selectedDiscount === 'all' ||
        (selectedDiscount === 'with' && hasDiscount(product.price, product.sale_price)) ||
        (selectedDiscount === 'without' && !hasDiscount(product.price, product.sale_price));

      const priceOk =
        effectivePrice >= priceRange[0] && effectivePrice <= priceRange[1];

      const searchOk =
        query.length === 0 ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.sub_category.toLowerCase().includes(query) ||
        product.tags.some((tag) => tag.toLowerCase().includes(query));

      return categoryOk && discountOk && priceOk && searchOk;
    });

    if (sortBy === 'highest-price') {
      return [...filtered].sort(
        (a, b) => getEffectivePrice(b.price, b.sale_price) - getEffectivePrice(a.price, a.sale_price)
      );
    }

    if (sortBy === 'newest') {
      return [...filtered].reverse();
    }

    return [...filtered].sort(
      (a, b) => getEffectivePrice(a.price, a.sale_price) - getEffectivePrice(b.price, b.sale_price)
    );
  }, [products, selectedCategories, selectedDiscount, priceRange, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedDiscount !== 'all' ||
    searchQuery.trim().length > 0 ||
    priceRange[0] !== defaultPriceRange[0] ||
    priceRange[1] !== defaultPriceRange[1];

  const heading = useMemo(() => {
    if (selectedCategories.length > 0) {
      return selectedCategories.join(' & ');
    }
    if (searchQuery.trim()) {
      return `Results for "${searchQuery.trim()}"`;
    }
    return 'Products';
  }, [searchQuery, selectedCategories]);

  const sidebarFiltersKey = [
    selectedCategories.join('|'),
    selectedDiscount,
    priceRange.join('-'),
    availablePriceRange.join('-'),
    defaultPriceRange.join('-'),
  ].join('::');

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Navigation Bar */}
      <Header
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        
        <Breadcrumb
          selectedCategories={selectedCategories}
        />

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          <div className="hidden lg:block">
            
            <SidebarFilters
              key={sidebarFiltersKey}
              categories={categories}
              selectedCategories={selectedCategories}
              selectedDiscount={selectedDiscount}
              priceRange={priceRange}
              defaultPriceRange={defaultPriceRange}
              availablePriceRange={availablePriceRange}
              onCategoryChange={toggleCategory}
              onDiscountChange={(value) => setDiscount(value as 'all' | 'with' | 'without')}
              onPriceChange={setPriceRange}
              onClearAll={clearAllFilters}
            />
            
          </div>

          <div className="flex-1">
            <div className="mb-6 flex items-start justify-between gap-3 sm:mb-4 sm:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {heading}
                  </h1>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found)
                  </p>
                </div>
              </div>

              <div className="relative min-w-48 shrink-0">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span className="hidden sm:inline">Sort by: <span className='font-bold'>{sortBy === 'lowest-price' ? ' Lowest Price' : sortBy === 'highest-price' ? ' Highest Price' : 'Newest'}</span></span>
                  <span className="sm:hidden">{sortBy === 'lowest-price' ? 'Lowest' : sortBy === 'highest-price' ? 'Highest' : 'Newest'}</span>
                  <ChevronDown size={18} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>
                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        setSortBy('lowest-price');
                        setIsSortOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Lowest Price
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('highest-price');
                        setIsSortOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Highest Price
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('newest');
                        setIsSortOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Newest
                    </button>
                  </div>
                )}
              </div>
              </div>
              

              <div className="flex flex-col sm:flex-row w-full gap-3 sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700"
                  >
                    <SlidersHorizontal size={16} />
                    Filters
                  </button>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs sm:text-sm font-medium text-lime-600 hover:text-lime-700"
                    >
                      Reset
                    </button>
                  )}
                </div>

                
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                {filteredProducts.map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} onAddToCart={addToCart} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-6xl mb-4">🛍️</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No products found</h2>
                <p className="text-gray-600 mb-6">Try adjusting your filters to find what you&apos;re looking for</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-lime-500 text-gray-900 font-semibold rounded-lg hover:bg-lime-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              className="absolute inset-0 bg-black/40"
              aria-label="Close filters"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white p-4 overflow-y-auto">
              <SidebarFilters
                key={sidebarFiltersKey}
                categories={categories}
                selectedCategories={selectedCategories}
                selectedDiscount={selectedDiscount}
                priceRange={priceRange}
                defaultPriceRange={defaultPriceRange}
                availablePriceRange={availablePriceRange}
                onCategoryChange={toggleCategory}
                onDiscountChange={(value) => setDiscount(value as 'all' | 'with' | 'without')}
                onPriceChange={setPriceRange}
                onClearAll={clearAllFilters}
                onClose={() => setIsMobileFiltersOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}