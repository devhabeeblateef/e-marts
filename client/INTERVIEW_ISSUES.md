# Code Quality & Interview Issues Report

## 🔴 CRITICAL ISSUES (Block Interview)

### 1. **Type Safety - Undefined Types**
- ❌ `SidebarFiltersProps` used in `SidebarFilters.tsx` but never defined
- ❌ `BreadcrumbProps` used in `BreadCrumb.tsx` but never defined
- **Impact**: Runtime errors, TypeScript should be strict
- **Fix**: Define interfaces in respective component files

### 2. **Missing Error Boundaries & Error Handling**
- ❌ No error boundary component
- ❌ No try-catch for Zustand operations
- ❌ No fallback UI if products fail to load
- ❌ No error handling for image loading failures
- **Impact**: App crashes silently, breaks on production
- **Fix**: Add ErrorBoundary component, error states in store

### 3. **Code Duplication - Business Logic Scattered**
- ❌ `getEffectivePrice()` defined in 2 places (store + page.tsx)
- ❌ `hasDiscount()` defined in 2 places  
- ❌ Filter logic duplicated in multiple useMemos
- **Impact**: Hard to maintain, bugs in one place not fixed in another
- **Fix**: Create utility functions, use selectors from store

### 4. **Performance - Zustand Selector Anti-Pattern**
- ❌ 20+ individual Zustand selectors in Home component
```tsx
const products = useProductStore((state) => state.products);
const selectedCategories = useProductStore((state) => state.selectedCategories);
// ... 18 more individual selectors
```
- **Impact**: Component re-renders on ANY store change, even unrelated fields
- **Fix**: Create a custom hook with single selector, use shallowEqual comparisons

### 5. **Hardcoded Values & Magic Numbers**
- ❌ `scrollThreshold = 8` hardcoded in Header
- ❌ `slice(0, 6)` hardcoded search results limit
- ❌ Score calculations hardcoded (100, 60, 40, 25, etc.)
- ❌ "Mens-clothing" hardcoded in BreadCrumb
- **Impact**: Unmaintainable, violates DRY principle
- **Fix**: Move to constants file

### 6. **Missing Type Definitions**
- ❌ Component props not typed: `ProductCard` slightly typed, others incomplete
- ❌ Dynamic typing with `any` or unsafe casts
- ❌ Zustand store missing complete return type
- **Impact**: No compile-time safety, runtime surprises
- **Fix**: Add strict `tsconfig.json` settings, complete all prop types

### 7. **Accessibility Issues**
- ❌ Images missing alt text consistency
- ❌ Color-only indicators (discount badge - should have text)
- ❌ Missing ARIA labels on interactive elements
- ❌ Keyboard navigation not tested
- **Impact**: Fails WCAG compliance, bad for users
- **Fix**: Add proper ARIA attributes, semantic HTML

### 8. **No Input Validation**
- ❌ Cart can increment infinitely (no max limit)
- ❌ Price inputs in SidebarFilters have validation but no max validation
- ❌ Search query not sanitized (potential XSS if data comes from API)
- ❌ Product quantity from JSON not validated
- **Impact**: Security and data integrity risks
- **Fix**: Add runtime validation library (Zod, Yup)

---

## 🟠 MAJOR ISSUES (Cost you points in interview)

### 9. **Inefficient Re-renders**
- ❌ `currentQueryString` recalculated on every render
- ❌ `categories` memo recalculated every time products change
- ❌ `searchSuggestions` huge useMemo doing full array filtering
- **Impact**: Slow on large datasets (1000+ products)
- **Fix**: Optimize dependencies, move to server-side computation

### 10. **Memory Leaks**
- ⚠️ Event listeners added but cleanup inconsistent
- ⚠️ `desktopSearchRef` and `mobileSearchRef` in Header never cleaned up properly
- **Impact**: Slow app over time on long sessions
- **Fix**: Ensure all event listeners have proper cleanup

### 11. **Missing Constants File**
- ❌ Magic numbers scattered: 2 (minimum search length), 6 (results limit), 8 (scroll threshold)
- ❌ Sort/discount options hardcoded as const arrays
- **Impact**: Single change requires hunting through codebase
- **Fix**: Create `lib/constants.ts`

### 12. **Unused Code**
- ❌ `removeCategory` method in store never called
- ❌ `selectFilteredProducts` selector in store created but never used
- ❌ `selectCategories` selector created but logic duplicated in page.tsx
- **Impact**: Dead code, confuses future developers
- **Fix**: Remove unused code or use it consistently

### 13. **No Loading States**
- ❌ No skeleton screens on first load
- ❌ No loading states for filter changes
- ❌ No pending states during router.replace
- **Impact**: Feels broken/slow to users
- **Fix**: Add proper loading indicators

### 14. **Missing Tests**
- ❌ No unit tests for filters
- ❌ No integration tests for search
- ❌ No tests for price range validation
- **Impact**: Regressions go unnoticed
- **Fix**: Add Jest + React Testing Library tests

### 15. **Poor Naming**
- ❌ `draftMin`, `draftMax` unclear naming
- ❌ `sameCategories` should be `categoriesMatch`
- ❌ Variable `score` for search ranking unclear
- **Impact**: Code is harder to read
- **Fix**: Use clearer, domain-specific names

---

## 🟡 MEDIUM ISSUES (Reduce score)

### 16. **Wrong Use of Router**
- ⚠️ `router.replace()` should use `router.push()` for back button functionality
- **Fix**: Only use replace for state sync, not navigation

### 17. **Incomplete Error Messages**
- ⚠️ Price validation error messages reference "₦" symbol but not localized
- **Fix**: Use proper i18n if supporting multiple currencies

### 18. **Missing Memoization**
- ⚠️ `suggestionList` JSX recreated every render in Header
- **Fix**: Wrap in useMemo or extract as component

### 19. **Hardcoded Text**
- ⚠️ "Few Units Left", "Out of Stock", "No products found" not abstracted
- ⚠️ Should be in constants or i18n file
- **Fix**: Create text constants file

### 20. **No PropTypes Validation**
- ⚠️ Only using TypeScript, no runtime validation
- **Fix**: Add Zod/Yup for schema validation

### 21. **Image Optimization Issues**
- ⚠️ `sizes` prop in ProductCard not accurate for all breakpoints
- ⚠️ No blur placeholder while loading
- **Fix**: Add placeholder, improve sizes calculation

### 22. **Stale Closures**
- ⚠️ `handleSavePrice` in SidebarFilters closes over stale `draftMin`/`draftMax`
- **Fix**: Use state updater functions or ref

---

## 🔵 MINOR ISSUES (Lose small points)

### 23. **Code Formatting**
- Extra blank lines (Footer, Header)
- Inconsistent spacing
- Mixed import styles (default vs named)

### 24. **Missing JSDoc Comments** (now that we removed others)
- Complex functions like `buildQueryString()` need documentation
- `getEffectivePrice()` logic needs explanation

### 25. **No Environment Variables**
- API endpoints hardcoded
- No .env.local setup documented

### 26. **Missing README**
- Team doesn't know how to set up/run project
- No setup instructions

### 27. **Unused Dependencies**
- Check if all imports are used
- Remove unused packages from package.json

### 28. **No TypeScript Strict Mode**
- `tsconfig.json` might have lenient settings
- Fix: Enable `strict: true`

---

## 📋 INTERVIEW-KILLER CHECKLIST

| Issue | Finding | Status |
|-------|---------|--------|
| Error Boundaries | ❌ None implemented | CRITICAL |
| Type Safety | ❌ Undefined types | CRITICAL |
| Code Duplication | ❌ Multiple implementations | CRITICAL |
| Performance | ⚠️ Inefficient selectors | MAJOR |
| Tests | ❌ Zero tests | MAJOR |
| Comments/Docs | ❌ Removed, no JSDoc | MEDIUM |
| Accessibility | ⚠️ Incomplete | MEDIUM |
| Input Validation | ❌ Minimal | MEDIUM |

---

## ✅ ACTION ITEMS (Priority Order)

1. **Define missing types** (SidebarFiltersProps, BreadcrumbProps)
2. **Add Error Boundary** component
3. **Extract duplicate logic** to utility functions
4. **Optimize Zustand selectors** with custom hook
5. **Add input validation** with Zod
6. **Write unit tests** for filters and utils
7. **Create constants file** for magic numbers
8. **Add JSDoc comments** to complex functions
9. **Improve accessibility** - run audit tool
10. **Add loading states** and error handling
