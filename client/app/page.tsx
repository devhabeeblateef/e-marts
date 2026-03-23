'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { SidebarFilters } from '@/components/SidebarFilters';
import { Footer } from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Breadcrumb } from '@/components/BreadCrumb';
import { ProductGridSkeleton } from '@/components/SkeletonLoader';
import { ArrowLeft, Check, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SORT_OPTIONS, DISCOUNT_OPTIONS, SEARCH_CONFIG, MESSAGES } from '@/lib/constants';
import { getEffectivePrice, hasDiscount, searchScoring } from '@/lib/product-utils';
import type { DiscountFilterOption } from '@/types/sidebar';

import { useProductStore } from '@/store/useProductStore';

type SearchSuggestion = {
  id: string;
  label: string;
  meta: string;
};

function buildQueryString({
  defaultPriceRange,
  priceRange,
  searchQuery,
  selectedCategories,
  selectedDiscount,
  sortBy,
}: {
  defaultPriceRange: [number, number];
  priceRange: [number, number];
  searchQuery: string;
  selectedCategories: string[];
  selectedDiscount: 'all' | 'with' | 'without';
  sortBy: 'lowest-price' | 'highest-price' | 'newest';
}) {
  const params = new URLSearchParams();

  if (searchQuery.trim()) {
    params.set('q', searchQuery.trim());
  }

  if (selectedCategories.length > 0) {
    params.set('categories', selectedCategories.join(','));
  }

  if (selectedDiscount !== 'all') {
    params.set('discount', selectedDiscount);
  }

  if (sortBy !== 'lowest-price') {
    params.set('sort', sortBy);
  }

  if (priceRange[0] !== defaultPriceRange[0] || priceRange[1] !== defaultPriceRange[1]) {
    params.set('min', String(priceRange[0]));
    params.set('max', String(priceRange[1]));
  }

  return params.toString();
}


function HomeContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSyncedQueryString = useRef('');
  const [searchInput, setSearchInput] = useState('');
  const [isHydrating, setIsHydrating] = useState(true);

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

  const searchSuggestions = useMemo<SearchSuggestion[]>(() => {
    try {
      const query = searchInput.trim().toLowerCase();

      if (query.length < SEARCH_CONFIG.MIN_QUERY_LENGTH) {
        return [];
      }

      return products
        .map((product) => {
          const score = searchScoring(
            product.name.toLowerCase(),
            product.category.toLowerCase(),
            product.sub_category.toLowerCase(),
            product.vendor_name.toLowerCase(),
            product.tags,
            query
          );

          if (score === 0) {
            return null;
          }

          return {
            id: product.id,
            label: product.name,
            meta: `${product.category} · ${product.sub_category}`,
            score,
          };
        })
        .filter((suggestion): suggestion is SearchSuggestion & { score: number } => suggestion !== null)
        .sort((left, right) => right.score - left.score || left.label.localeCompare(right.label))
        .slice(0, SEARCH_CONFIG.MAX_SUGGESTIONS)
        .map(({ id, label, meta }) => ({ id, label, meta }));
    } catch (error) {
      console.error('Error generating search suggestions:', error);
      return [];
    }
  }, [products, searchInput]);

  const currentQueryString = searchParams.toString();

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(currentQueryString);
      const categoriesParam = params.get('categories');
      const discountParam = params.get('discount');
      const sortParam = params.get('sort');
      const queryParam = params.get('q');
      const minParam = params.get('min');
      const maxParam = params.get('max');

      const nextCategories = categoriesParam
        ? categoriesParam
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0 && categories.includes(item))
        : [];

      const nextDiscount = DISCOUNT_OPTIONS.includes(discountParam as typeof DISCOUNT_OPTIONS[number])
        ? (discountParam as 'all' | 'with' | 'without')
        : 'all';

      const nextSort = SORT_OPTIONS.includes(sortParam as typeof SORT_OPTIONS[number])
        ? (sortParam as 'lowest-price' | 'highest-price' | 'newest')
        : 'lowest-price';

      const nextSearchQuery = queryParam?.trim() ?? '';

      const parsedMin = minParam ? Number(minParam) : defaultPriceRange[0];
      const parsedMax = maxParam ? Number(maxParam) : defaultPriceRange[1];
      const safeMin = Number.isFinite(parsedMin)
        ? Math.max(defaultPriceRange[0], Math.min(parsedMin, defaultPriceRange[1]))
        : defaultPriceRange[0];
      const safeMax = Number.isFinite(parsedMax)
        ? Math.max(defaultPriceRange[0], Math.min(parsedMax, defaultPriceRange[1]))
        : defaultPriceRange[1];
      const nextPriceRange: [number, number] = safeMin <= safeMax ? [safeMin, safeMax] : [safeMax, safeMin];

      const currentState = useProductStore.getState();

      const sameCategories =
        currentState.selectedCategories.length === nextCategories.length &&
        currentState.selectedCategories.every((item, index) => item === nextCategories[index]);
      const sameDiscount = currentState.selectedDiscount === nextDiscount;
      const sameSort = currentState.sortBy === nextSort;
      const sameQuery = currentState.searchQuery === nextSearchQuery;
      const samePrice =
        currentState.priceRange[0] === nextPriceRange[0] &&
        currentState.priceRange[1] === nextPriceRange[1];

      lastSyncedQueryString.current = currentQueryString;

      if (!sameCategories || !sameDiscount || !sameSort || !sameQuery || !samePrice) {
        useProductStore.setState({
          selectedCategories: nextCategories,
          selectedDiscount: nextDiscount,
          sortBy: nextSort,
          searchQuery: nextSearchQuery,
          priceRange: nextPriceRange,
        });
      }
    } catch (error) {
      console.error('Error hydrating URL state:', error);
    } finally {
      setIsHydrating(false);
    }
  }, [
    categories,
    currentQueryString,
    defaultPriceRange,
  ]);

  useEffect(() => {
    try {
      const nextQueryString = buildQueryString({
        defaultPriceRange,
        priceRange,
        searchQuery,
        selectedCategories,
        selectedDiscount,
        sortBy,
      });

      if (nextQueryString !== lastSyncedQueryString.current) {
        lastSyncedQueryString.current = nextQueryString;
        router.replace(nextQueryString ? `${pathname}?${nextQueryString}` : pathname, {
          scroll: false,
        });
      }
    } catch (error) {
      console.error('Error syncing URL state:', error);
    }
  }, [
    defaultPriceRange,
    pathname,
    priceRange,
    router,
    searchQuery,
    selectedCategories,
    selectedDiscount,
    sortBy,
  ]);

  const availablePriceRange = useMemo<[number, number]>(() => {
    try {
      const query = searchQuery.trim().toLowerCase();

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
    } catch (error) {
      console.error('Error calculating available price range:', error);
      return defaultPriceRange;
    }
  }, [defaultPriceRange, products, searchQuery, selectedCategories, selectedDiscount]);

  const filteredProducts = useMemo(() => {
    try {
      const query = searchQuery.trim().toLowerCase();

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
    } catch (error) {
      console.error('Error filtering products:', error);
      return [];
    }
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
    return 'Mens Clothing';
  }, [searchQuery, selectedCategories]);

  const sidebarFiltersKey = [
    selectedCategories.join('|'),
    selectedDiscount,
    priceRange.join('-'),
    availablePriceRange.join('-'),
    defaultPriceRange.join('-'),
  ].join('::');

  return (
    <ErrorBoundary>
    <>
    <main className="bg-gray-50 min-h-screen pb-20 lg:pb-0">
      <Header
        cartCount={cartCount}
        searchInput={searchInput}
        searchSuggestions={searchSuggestions}
        onSearchInputChange={setSearchInput}
        onSearchSelect={(value) => {
          setSearchInput(value);
          setSearchQuery(value);
        }}
      />

      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
          <Breadcrumb
            selectedCategories={selectedCategories}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
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
              onDiscountChange={(value: DiscountFilterOption) => setDiscount(value)}
              onPriceChange={setPriceRange}
              onClearAll={clearAllFilters}
            />
            
          </div>

          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 w-24"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>

              <div className="relative w-24">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full flex items-center justify-between px-2.5 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span>{sortBy === 'lowest-price' ? 'Lowest' : sortBy === 'highest-price' ? 'Highest' : 'Newest'}</span>
                  <ChevronDown size={18} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>
                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        setSortBy('lowest-price');
                        setIsSortOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center">
                        {sortBy === 'lowest-price' && <Check size={14} className="text-gray-900" />}
                      </span>
                      Lowest Price
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('highest-price');
                        setIsSortOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center">
                        {sortBy === 'highest-price' && <Check size={14} className="text-gray-900" />}
                      </span>
                      Highest Price
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('newest');
                        setIsSortOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center">
                        {sortBy === 'newest' && <Check size={14} className="text-gray-900" />}
                      </span>
                      Newest
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4 lg:hidden">
              <div className="flex flex-wrap items-baseline gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {heading}
                </h1>
                <p className="text-xs text-gray-600 sm:text-sm">
                  ({filteredProducts.length} product(s) found)
                </p>
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

            <div className="mb-4 hidden lg:flex items-start justify-between gap-3 sm:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {heading}
                  </h1>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    ({filteredProducts.length} product(s) found)
                  </p>
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
                      className="w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center">
                        {sortBy === 'lowest-price' && <Check size={14} className="text-gray-900" />}
                      </span>
                      Lowest Price
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('highest-price');
                        setIsSortOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center">
                        {sortBy === 'highest-price' && <Check size={14} className="text-gray-900" />}
                      </span>
                      Highest Price
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('newest');
                        setIsSortOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center">
                        {sortBy === 'newest' && <Check size={14} className="text-gray-900" />}
                      </span>
                      Newest
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isHydrating ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <LoadingSpinner />
                </div>
                <ProductGridSkeleton count={8} />
              </div>
            ) : filteredProducts.length > 0 ? (
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
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{MESSAGES.NO_PRODUCTS_FOUND}</h2>
                <p className="text-gray-600 mb-6">{MESSAGES.ADJUST_FILTERS}</p>
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
            <div className="absolute inset-0 bg-white flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="inline-flex items-center gap-1 text-sm font-medium text-gray-900"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                <h2 className="text-base font-semibold text-gray-900">Filters</h2>
                <div className="w-10" />
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <SidebarFilters
                  key={sidebarFiltersKey}
                  categories={categories}
                  selectedCategories={selectedCategories}
                  selectedDiscount={selectedDiscount}
                  priceRange={priceRange}
                  defaultPriceRange={defaultPriceRange}
                  availablePriceRange={availablePriceRange}
                  onCategoryChange={toggleCategory}
                  onDiscountChange={(value: DiscountFilterOption) => setDiscount(value)}
                  onPriceChange={setPriceRange}
                  onClearAll={clearAllFilters}
                  isMobileFullscreen
                />
              </div>

              <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full rounded-lg bg-gray-200 px-4 py-3 text-black font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
    <Footer />
    </>
    </ErrorBoundary>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="bg-gray-50 min-h-screen pb-20 lg:pb-0">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <LoadingSpinner />
              </div>
              <ProductGridSkeleton count={8} />
            </div>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}