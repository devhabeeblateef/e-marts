'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { BellRing, ShoppingCart, UserCircle } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function Header({ cartCount, searchQuery, onSearchChange }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-gray-200 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="text-xl sm:text-2xl font-bold">
              <Image src="emart-logo.svg" width={100} height={100} alt="Emarts Logo" />
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search products, brands and categories..."
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
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
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
     <button className="relative">
  <div className="bg-lime-300 p-3 rounded-full inline-flex items-center justify-center hover:cursor-pointer transition-colors">
    <ShoppingCart size={22} className="text-gray-600" />
  </div>

  {cartCount > 0 && (
    <span className="absolute top-1 right-1 bg-gray-900 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
      {cartCount}
    </span>
  )}
</button>

            <button className="relative">
  <div className="bg-lime-300  p-3 rounded-full inline-flex items-center justify-center hover:cursor-pointer transition-colors">
    <BellRing size={22} className="text-gray-600" />
  </div>
</button>

            <button className="flex items-center gap-2 text-gray-900 transition-colors">
              <UserCircle size={28} />
              <span className="hiddenn hover:cursor-pointer sm:inline text-sm font-medium">Sign In / Up</span>
            </button>
          </div>
        </div>
        <div className="mt-2 md:hidden">
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-lime-500 rounded-full text-sm placeholder-gray-500 focus:outline-none"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M14 14L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
