import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  getProductsForListing,
  getProductsPaginated,
  getProduct,
  getRelatedProducts,
  getCategories,
  getProductCountByCategory,
} from '../lib/store';
import { Product } from '../types';

const PAGE_SIZE = 12;

// Cached product listing for Home (featured) — limited count
export function useProductListing(limit?: number) {
  return useQuery<Product[]>({
    queryKey: limit ? ['products', 'listing', limit] : ['products', 'listing'],
    queryFn: () => getProductsForListing(limit),
  });
}

/**
 * Paginated product listing with "Load More" support.
 * Fetches PAGE_SIZE products per page, with optional category and search filters.
 */
export function usePaginatedProducts(category?: string, search?: string) {
  return useInfiniteQuery({
    queryKey: ['products', 'paginated', category || '', search || ''],
    queryFn: ({ pageParam = 0 }) => getProductsPaginated(pageParam, PAGE_SIZE, category, search),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length : undefined,
    initialPageParam: 0,
  });
}

// Cached single product by ID (full data including description)
export function useProductDetail(id: string | undefined) {
  return useQuery<Product | null>({
    queryKey: ['products', 'detail', id],
    queryFn: () => (id ? getProduct(id) : Promise.resolve(null)),
    enabled: !!id,
  });
}

// Cached related products — targeted server-side query, limited to 8
export function useRelatedProducts(category: string | undefined, excludeId: string | undefined) {
  return useQuery<Product[]>({
    queryKey: ['products', 'related', category, excludeId],
    queryFn: () =>
      category && excludeId
        ? getRelatedProducts(category, excludeId, 8)
        : Promise.resolve([]),
    enabled: !!category && !!excludeId,
  });
}

// Cached categories
export function useCategories() {
  return useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60_000, // Categories change rarely — 5 min stale time
  });
}

/**
 * Lightweight category product count — returns { "Bedsheets": 45, "Sarees": 12, ... }
 * Used on Home page to show "Coming Soon" badges without downloading all products.
 */
export function useProductCountByCategory() {
  return useQuery<Record<string, number>>({
    queryKey: ['products', 'categoryCount'],
    queryFn: getProductCountByCategory,
    staleTime: 5 * 60_000,
  });
}
