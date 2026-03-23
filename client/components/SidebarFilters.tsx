'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export function SidebarFilters({
  categories,
  selectedCategories,
  selectedDiscount,
  priceRange,
  defaultPriceRange,
  availablePriceRange,
  onCategoryChange,
  onDiscountChange,
  onPriceChange,
  onClearAll,
  onClose,
}: SidebarFiltersProps) {
  const [availableMin, availableMax] = availablePriceRange;

  const [draftMin, setDraftMin] = useState(availableMin.toString());
  const [draftMax, setDraftMax] = useState(availableMax.toString());
  const [minError, setMinError] = useState('');
  const [maxError, setMaxError] = useState('');

  const hasCustomPrice =
    priceRange[0] !== defaultPriceRange[0] || priceRange[1] !== defaultPriceRange[1];
  const hasActiveFilters =
    selectedCategories.length > 0 || selectedDiscount !== 'all' || hasCustomPrice;

  const validatePriceInputs = (nextMin: string, nextMax: string) => {
    const parsedMin = nextMin.trim() === '' ? availableMin : Number(nextMin);
    const parsedMax = nextMax.trim() === '' ? availableMax : Number(nextMax);

    let nextMinError = '';
    let nextMaxError = '';

    if (!Number.isFinite(parsedMin)) {
      nextMinError = 'Minimum price must be a valid number.';
    } else if (parsedMin < availableMin) {
      nextMinError = `Minimum price is ₦${availableMin.toLocaleString()}.`;
    }

    if (!Number.isFinite(parsedMax)) {
      nextMaxError = 'Maximum price must be a valid number.';
    } else if (parsedMax > availableMax) {
      nextMaxError = `Maximum price is ₦${availableMax.toLocaleString()}.`;
    }

    if (!nextMinError && !nextMaxError && parsedMin > parsedMax) {
      nextMinError = 'Minimum price cannot be greater than maximum price.';
      nextMaxError = 'Maximum price cannot be less than minimum price.';
    }

    setMinError(nextMinError);
    setMaxError(nextMaxError);

    return nextMinError === '' && nextMaxError === '';
  };

  const handleSavePrice = () => {
    const parsedMin = draftMin.trim() === '' ? availableMin : Number(draftMin);
    const parsedMax = draftMax.trim() === '' ? availableMax : Number(draftMax);

    if (!validatePriceInputs(draftMin, draftMax)) {
      return;
    }

    onPriceChange(parsedMin, parsedMax);
  };

  const handleClearPrice = () => {
    onPriceChange(defaultPriceRange[0], defaultPriceRange[1]);
  };

  const handleClearAll = () => {
    onClearAll();
  };

  return (
    <aside className="w-full lg:w-80 bg-white border border-gray-200 rounded-lg p-4 sm:p-6 h-fit lg:sticky lg:top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="text-sm cursor-pointer text-black font-medium"
            >
              Clear All
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mb-8 flex flex-wrap gap-3">
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <div
                key={category}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700"
              >
                <span>{category}</span>
                <button
                  onClick={() => onCategoryChange(category, false)}
                  className="text-gray-500 hover:text-gray-800"
                  aria-label={`Remove ${category} filter`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {selectedDiscount !== 'all' && (
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700">
                <span>{selectedDiscount === 'with' ? 'With Discount' : 'Without Discount'}</span>
                <button
                  onClick={() => onDiscountChange('all')}
                  className="text-gray-500 hover:text-gray-800"
                  aria-label="Remove discount filter"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {hasCustomPrice && (
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700">
                <span>
                  ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
                </span>
                <button
                  onClick={handleClearPrice}
                  className="text-gray-500 hover:text-gray-800"
                  aria-label="Remove price filter"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="mb-4 font-semibold text-sm text-gray-900">Discount</h3>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <label className="flex cursor-pointer items-center gap-3 px-4 py-5 transition-colors hover:bg-gray-50">
            <input
              type="radio"
              name="discount"
              value="all"
              checked={selectedDiscount === 'all'}
              onChange={() => onDiscountChange('all')}
              className="h-5 w-5 cursor-pointer accent-lime-500"
            />
            <span className="text-sm font-light text-gray-700">Show All</span>
          </label>
          <div className="mx- font-light border-t border-gray-200" />
          <label className="flex cursor-pointer items-center gap-3 px-4 py-5 transition-colors hover:bg-gray-50">
            <input
              type="radio"
              name="discount"
              value="with"
              checked={selectedDiscount === 'with'}
              onChange={() => onDiscountChange('with')}
              className="h-5 w-5 cursor-pointer accent-lime-500"
            />
            <span className="text-sm font-light text-gray-700">With Discount</span>
          </label>
          <div className="mx-4 border-t border-gray-200" />
          <label className="flex cursor-pointer items-center gap-3 px-4 py-5 transition-colors hover:bg-gray-50">
            <input
              type="radio"
              name="discount"
              value="without"
              checked={selectedDiscount === 'without'}
              onChange={() => onDiscountChange('without')}
              className="h-5 w-5 cursor-pointer accent-lime-500"
            />
            <span className="text-sm font-light text-gray-700">Without Discount</span>
          </label>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-4 font-semibold text-gray-900">Price (₦)</h3>
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-400">₦{availableMin.toLocaleString()}</p>
              <input
                type="number"
                placeholder="Min"
                value={draftMin}
                min={availableMin}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  setDraftMin(nextValue);
                  validatePriceInputs(nextValue, draftMax);
                }}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                  minError ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-lime-500'
                }`}
              />
              {minError && (
                <p className="mt-2 text-xs text-red-500">{minError}</p>
              )}
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-400">₦{availableMax.toLocaleString()}</p>
              <input
                type="number"
                placeholder="Max"
                value={draftMax}
                max={availableMax}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  setDraftMax(nextValue);
                  validatePriceInputs(draftMin, nextValue);
                }}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                  maxError ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-lime-500'
                }`}
              />
              {maxError && (
                <p className="mt-2 text-xs text-red-500">{maxError}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleClearPrice}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Clear
            </button>
            <button
              onClick={handleSavePrice}
              className="text-sm font-semibold text-lime-500 hover:text-lime-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-gray-900">Categories</h3>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          {categories.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-3 border-b border-gray-200 px-4 py-4 transition-colors hover:bg-gray-50 last:border-b-0"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={(e) => onCategoryChange(category, e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-lime-500"
              />
              <span className="text-sm font-medium text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
