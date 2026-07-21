import { useQuery } from '@tanstack/react-query';
import { getProductsForListing, getProduct, getRelatedProducts, getCategories } from '../lib/store';
import { Product } from '../types';

// Cached product listing for Home / Products pages
export function useProductListing(limit?: number) {
  return useQuery<Product[]>({
    queryKey: limit ? ['products', 'listing', limit] : ['products', 'listing'],
    queryFn: () => getProductsForListing(limit),
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

// Cached related products — targeted server-side query
export function useRelatedProducts(category: string | undefined, excludeId: string | undefined) {
  return useQuery<Product[]>({
    queryKey: ['products', 'related', category, excludeId],
    queryFn: () =>
      category && excludeId
        ? getRelatedProducts(category, excludeId, 4)
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
