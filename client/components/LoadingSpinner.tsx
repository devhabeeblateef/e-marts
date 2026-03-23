export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-lime-600 animate-bounce">e</span>
        </div>
        <svg
          className="absolute inset-0 animate-spin text-lime-600"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-100">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    </div>
  );
}
