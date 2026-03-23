'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { BellRing, House, Menu, Search, ShoppingCart, Store, UserCircle, X } from 'lucide-react';
import { SEARCH_CONFIG, HEADER_CONFIG, MESSAGES } from '@/lib/constants';

type SearchSuggestion = {
  id: string;
  label: string;
  meta: string;
};

interface HeaderProps {
  cartCount: number;
  searchInput: string;
  searchSuggestions: SearchSuggestion[];
  onSearchInputChange: (value: string) => void;
  onSearchSelect: (value: string) => void;
}

export function Header({
  cartCount,
  searchInput,
  searchSuggestions,
  onSearchInputChange,
  onSearchSelect,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [scrollThreshold] = useState(HEADER_CONFIG.SCROLL_THRESHOLD);
  const [isDesktopSearchFocused, setIsDesktopSearchFocused] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > scrollThreshold;
      setIsScrolled(scrolled);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollThreshold]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (desktopSearchRef.current && !desktopSearchRef.current.contains(target)) {
        setIsDesktopSearchFocused(false);
      }

      if (mobileSearchRef.current && !mobileSearchRef.current.contains(target)) {
        setIsMobileSearchFocused(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  const showMobileSearch = isMobileSearchOpen;
  const showDesktopSuggestions = isDesktopSearchFocused && searchInput.trim().length >= SEARCH_CONFIG.MIN_QUERY_LENGTH;
  const showMobileSuggestions = isMobileSearchFocused && searchInput.trim().length >= SEARCH_CONFIG.MIN_QUERY_LENGTH;

  const suggestionList = (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      {searchSuggestions.length > 0 ? (
        searchSuggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            className="flex w-full flex-col items-start gap-1 px-4 py-3 text-left hover:bg-gray-50"
            onMouseDown={(event) => {
              event.preventDefault();
              onSearchSelect(suggestion.label);
              setIsDesktopSearchFocused(false);
              setIsMobileSearchFocused(false);
            }}
          >
            <span className="text-sm font-medium text-gray-900">{suggestion.label}</span>
            <span className="text-xs text-gray-500">{suggestion.meta}</span>
          </button>
        ))
      ) : (
        <div className="px-4 py-3 text-sm text-gray-500" role="status" aria-live="polite">
          {MESSAGES.NO_CLOSE_MATCHES}
        </div>
      )}
    </div>
  );

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-gray-200 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md' : 'bg-white'
      }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="text-xl sm:text-2xl font-bold">
                <Image src="/emart-logo.svg" width={120} height={120} alt="Emarts Logo" />
              </div>
            </div>

            <div className="hidden lg:flex flex-1 max-w-md mx-4 lg:mx-8">
              <div ref={desktopSearchRef} className="w-full relative">
                <input
                  type="text"
                  placeholder="Search products, brands and categories..."
                  value={searchInput}
                  onChange={(event) => onSearchInputChange(event.target.value)}
                  onFocus={() => setIsDesktopSearchFocused(true)}
                  className="w-full px-4 py-3 bg-white border-2 border-lime-500 rounded-full text-sm placeholder-gray-500 focus:outline-none text-black"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path d="M14 14L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                {showDesktopSuggestions && suggestionList}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <button className="relative shrink-0">
                <div className="bg-lime-300 p-3 rounded-full inline-flex items-center justify-center hover:cursor-pointer transition-colors">
                  <ShoppingCart size={22} className="text-gray-600" />
                </div>

                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-gray-900 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button className="relative hidden sm:block">
                <div className="bg-lime-300  p-3 rounded-full inline-flex items-center justify-center hover:cursor-pointer transition-colors">
                  <BellRing size={22} className="text-gray-600" />
                </div>
              </button>

              <button className="flex items-center gap-2 text-gray-900 transition-colors">
                <UserCircle size={28} />
                <span className="hidden hover:cursor-pointer sm:inline text-sm font-medium">Sign In / Up</span>
              </button>
            </div>
          </div>
          {showMobileSearch && (
            <div className="mt-2 lg:hidden">
              <div ref={mobileSearchRef} className="relative">
                <div className="flex items-center gap-2 rounded-full border-2 border-lime-500 bg-white px-2 py-1.5">
                  <button
                    aria-label="Close mobile search"
                    className="rounded-full p-1 text-gray-600 hover:bg-gray-100"
                    onClick={() => {
                      setIsMobileSearchFocused(false);
                      setIsMobileSearchOpen(false);
                    }}
                  >
                    <X size={18} />
                  </button>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchInput}
                    onChange={(event) => onSearchInputChange(event.target.value)}
                    onFocus={() => setIsMobileSearchFocused(true)}
                    className="w-full bg-transparent px-1 py-1 text-sm text-black placeholder-gray-500 focus:outline-none"
                  />
                  <button className="p-1 text-gray-500" aria-label="Search">
                    <Search size={18} />
                  </button>
                </div>
                {showMobileSuggestions && suggestionList}
              </div>
            </div>
          )}
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-md lg:hidden">
        <div className="mx-auto grid h-16 max-w-2xl grid-cols-5">
          <button className="flex flex-col items-center justify-center text-[11px] font-medium text-gray-500">
            <House size={20} />
            Home
          </button>
          <button className="flex flex-col items-center justify-center text-[11px] font-medium text-gray-500">
            <Store size={20} />
            Market
          </button>
          <button
            className={`flex flex-col items-center justify-center text-[11px] font-medium ${
              isMobileSearchOpen ? 'text-gray-900' : 'text-gray-500'
            }`}
            onClick={() => setIsMobileSearchOpen(true)}
          >
            <Search size={20} />
            Search
          </button>
          <button className="relative flex flex-col items-center justify-center text-[11px] font-medium text-gray-500">
            <ShoppingCart size={20} />
            Cart
            {cartCount > 0 && (
              <span className="absolute right-5 top-1 rounded-full bg-gray-900 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                {cartCount}
              </span>
            )}
          </button>
          <button className="flex flex-col items-center justify-center text-[11px] font-medium text-gray-500">
            <Menu size={20} />
            Menu
          </button>
        </div>
      </nav>
    </>
  );
}
