import { supabase } from './supabase';
import { Product } from '../types';

const PRODUCTS_TABLE = 'products';

// Helper to extract MRP embedded in description if original_price column is absent in DB
function extractOriginalPriceFromDescription(desc: string): { cleanDescription: string; embeddedMrp?: number } {
  if (!desc) return { cleanDescription: '' };
  const match = desc.match(/\[MRP:(\d+)\]/);
  if (match) {
    const embeddedMrp = Number(match[1]);
    const cleanDescription = desc.replace(/\s*\[MRP:\d+\]/g, '').trim();
    return { cleanDescription, embeddedMrp };
  }
  return { cleanDescription: desc };
}

// Helper to embed MRP into description string so original price is never lost if DB lacks original_price column
function embedOriginalPriceInDescription(desc: string = '', originalPrice?: number): string {
  const cleanDesc = desc.replace(/\s*\[MRP:\d+\]/g, '').trim();
  if (originalPrice && Number(originalPrice) > 0) {
    return cleanDesc ? `${cleanDesc}\n[MRP:${originalPrice}]` : `[MRP:${originalPrice}]`;
  }
  return cleanDesc;
}

// Map database snake_case to frontend camelCase
function mapProductFromDb(data: any): Product {
  const sellingPrice = data.selling_price !== undefined && data.selling_price !== null && data.selling_price !== ''
    ? Number(data.selling_price)
    : Number(data.price || 0);

  const rawDescription = data.description || '';
  const { cleanDescription, embeddedMrp } = extractOriginalPriceFromDescription(rawDescription);

  let originalPrice = data.original_price !== undefined && data.original_price !== null && data.original_price !== ''
    ? Number(data.original_price)
    : embeddedMrp;

  if (originalPrice !== undefined && originalPrice <= sellingPrice) {
    originalPrice = undefined;
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    price: sellingPrice,
    sellingPrice: sellingPrice,
    originalPrice: originalPrice,
    colorCombination: data.color_combination || '',
    material: data.material || '',
    description: cleanDescription,
    images: data.images || [],
    stockStatus: data.stock_status,
    ownerPhone: data.owner_phone || '',
    size: data.size || '',
    createdAt: data.created_at ? new Date(data.created_at) : new Date(),
    updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(),
  };
}

// Map frontend camelCase to database snake_case
function mapProductToDb(product: any) {
  const data: any = {};
  if (product.name !== undefined) data.name = product.name;
  if (product.category !== undefined) data.category = product.category;
  
  const effectiveSellingPrice = product.sellingPrice !== undefined 
    ? Number(product.sellingPrice) 
    : (product.price !== undefined ? Number(product.price) : undefined);
  
  if (effectiveSellingPrice !== undefined) {
    data.selling_price = effectiveSellingPrice;
    data.price = effectiveSellingPrice;
  }

  let effectiveOriginalPrice: number | null = null;
  if (product.originalPrice !== undefined && product.originalPrice !== null && product.originalPrice !== ('' as any)) {
    const parsedMrp = Number(product.originalPrice);
    if (!isNaN(parsedMrp) && parsedMrp > (effectiveSellingPrice || 0)) {
      effectiveOriginalPrice = parsedMrp;
    }
  }

  // Always map original_price: numeric if valid MRP > sellingPrice, otherwise null
  data.original_price = effectiveOriginalPrice;

  if (product.description !== undefined) {
    data.description = embedOriginalPriceInDescription(product.description, effectiveOriginalPrice || undefined);
  }

  if (product.colorCombination !== undefined) data.color_combination = product.colorCombination;
  if (product.material !== undefined) data.material = product.material;
  if (product.images !== undefined) data.images = product.images;
  if (product.stockStatus !== undefined) data.stock_status = product.stockStatus;
  if (product.ownerPhone !== undefined) data.owner_phone = product.ownerPhone;
  if (product.size !== undefined) data.size = product.size;
  return data;
}

// ---------------------------------------------------------------------------
// Column sets — each query fetches ONLY the columns it needs
// ---------------------------------------------------------------------------

// Card view: used for product grids on Home/Products pages.
// Fetches only the FIRST image (via images column) but NOT description, owner_phone, size.
// NOTE: The `images` column is still fetched because we need images[0] for thumbnails.
// Once a `thumbnail` column is added to the DB, switch to PRODUCT_CARD_COLUMNS_V2.
const PRODUCT_CARD_COLUMNS = 'id,name,category,price,selling_price,original_price,color_combination,material,images,stock_status,created_at,updated_at';

// Full detail: all columns needed for the product detail page
const PRODUCT_DETAIL_COLUMNS = 'id,name,category,price,selling_price,original_price,color_combination,material,description,images,stock_status,owner_phone,size,created_at,updated_at';

// Admin listing: same as card columns (admin table only shows thumbnail + basic info)
const ADMIN_LISTING_COLUMNS = PRODUCT_CARD_COLUMNS;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Get ALL products — used only by Admin for full management.
 * Uses explicit columns instead of select('*').
 */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select(ADMIN_LISTING_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) {
    // Fallback to select('*') if any column doesn't exist yet
    if (error.message?.includes('selling_price') || error.message?.includes('original_price')) {
      const fallback = await supabase
        .from(PRODUCTS_TABLE)
        .select('*')
        .order('created_at', { ascending: false });
      if (fallback.error) throw fallback.error;
      return (fallback.data || []).map(mapProductFromDb);
    }
    throw error;
  }
  return (data || []).map(mapProductFromDb);
}

/**
 * Slim query for listing pages — fetches only card-display columns with optional limit.
 * Used by Home (limit=12) and Products (paginated).
 */
export async function getProductsForListing(limit?: number): Promise<Product[]> {
  let query = supabase
    .from(PRODUCTS_TABLE)
    .select(PRODUCT_CARD_COLUMNS)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    // Fallback to select('*') if slim columns fail (e.g. selling_price not in DB yet)
    if (error.message?.includes('selling_price') || error.message?.includes('original_price')) {
      const fallback = await supabase
        .from(PRODUCTS_TABLE)
        .select('*')
        .order('created_at', { ascending: false });
      if (fallback.error) throw fallback.error;
      const all = (fallback.data || []).map(mapProductFromDb);
      return limit ? all.slice(0, limit) : all;
    }
    throw error;
  }
  return (data || []).map(mapProductFromDb);
}

/**
 * Paginated products query — fetches a specific page of products.
 * Supports optional category filter and search term for server-side filtering.
 */
export async function getProductsPaginated(
  page: number,
  pageSize: number,
  category?: string,
  search?: string,
): Promise<{ products: Product[]; hasMore: boolean }> {
  const from = page * pageSize;
  const to = from + pageSize; // fetch one extra to know if there's a next page

  let query = supabase
    .from(PRODUCTS_TABLE)
    .select(PRODUCT_CARD_COLUMNS)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (category) {
    query = query.eq('category', category);
  }

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    // Fallback: fetch all and slice manually
    const all = await getProductsForListing();
    let filtered = all;
    if (category) filtered = filtered.filter(p => p.category === category);
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    const sliced = filtered.slice(from, from + pageSize);
    return { products: sliced, hasMore: from + pageSize < filtered.length };
  }

  const items = (data || []).map(mapProductFromDb);
  const hasMore = items.length > pageSize;
  return { products: items.slice(0, pageSize), hasMore };
}

/**
 * Targeted query for related products — fetches limited rows server-side.
 */
export async function getRelatedProducts(category: string, excludeId: string, limit: number = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select(PRODUCT_CARD_COLUMNS)
    .eq('category', category)
    .neq('id', excludeId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    // Fallback if slim columns fail
    if (error.message?.includes('selling_price') || error.message?.includes('original_price')) {
      const all = await getProductsForListing();
      return all.filter(p => p.category === category && p.id !== excludeId).slice(0, limit);
    }
    throw error;
  }
  return (data || []).map(mapProductFromDb);
}

/**
 * Full single-product query for the detail page — includes description, images, owner_phone, size.
 */
export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select(PRODUCT_DETAIL_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    // Fallback to select('*') if explicit columns fail
    if (error.message?.includes('selling_price') || error.message?.includes('original_price')) {
      const fallback = await supabase
        .from(PRODUCTS_TABLE)
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (fallback.error) throw fallback.error;
      return fallback.data ? mapProductFromDb(fallback.data) : null;
    }
    throw error;
  }
  return data ? mapProductFromDb(data) : null;
}

/**
 * Lightweight query: get the count of products per category.
 * Returns ~200 bytes instead of ~120 MB. Used on Home page to show "Coming Soon" badges.
 */
export async function getProductCountByCategory(): Promise<Record<string, number>> {
  // Supabase doesn't support GROUP BY directly, so we fetch only the category column
  // and count client-side. This is ~200 products × ~20 bytes = ~4 KB — trivial.
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select('category');

  if (error) {
    console.warn('Failed to fetch category counts:', error.message);
    return {};
  }

  const counts: Record<string, number> = {};
  for (const row of data || []) {
    const cat = (row as any).category;
    if (cat) counts[cat] = (counts[cat] || 0) + 1;
  }
  return counts;
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const dbData = mapProductToDb(product);
  
  let { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .insert([dbData])
    .select()
    .single();

  if (error) {
    // Fallback if Supabase DB table hasn't added selling_price / original_price columns yet
    if (error.code === 'PGRST204' || error.message?.includes('selling_price') || error.message?.includes('original_price') || error.message?.includes('schema cache')) {
      delete dbData.selling_price;
      delete dbData.original_price;
      const retry = await supabase
        .from(PRODUCTS_TABLE)
        .insert([dbData])
        .select()
        .single();
      if (retry.error) throw retry.error;
      return retry.data.id;
    }
    throw error;
  }
  return data.id;
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
  const dbData = mapProductToDb(updates);
  dbData.updated_at = new Date().toISOString();

  let { error } = await supabase
    .from(PRODUCTS_TABLE)
    .update(dbData)
    .eq('id', id);

  if (error) {
    // Fallback if Supabase DB table hasn't added selling_price / original_price columns yet
    if (error.code === 'PGRST204' || error.message?.includes('selling_price') || error.message?.includes('original_price') || error.message?.includes('schema cache')) {
      delete dbData.selling_price;
      delete dbData.original_price;
      const retry = await supabase
        .from(PRODUCTS_TABLE)
        .update(dbData)
        .eq('id', id);
      if (retry.error) throw retry.error;
      return;
    }
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from(PRODUCTS_TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export function buildWhatsAppLink(product: Product, ownerPhone: string) {
  const productLink = `${window.location.origin}/product/${product.id}`;
  const currentPrice = product.sellingPrice ?? product.price;
  const priceDisplay = (product.originalPrice && product.originalPrice > currentPrice)
    ? `₹${currentPrice} (MRP: ₹${product.originalPrice})`
    : `₹${currentPrice}`;

  const message = `Hello Madhumitha Tex,
I am interested in this product.

Product: ${product.name}
Color: ${product.colorCombination}
Price: ${priceDisplay}
Link: ${productLink}

Please share more details.`;

  // remove any non-digit chars from phone just in case, except '+'
  const phone = ownerPhone.replace(/[^\d+]/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

const CATEGORIES_TABLE = 'categories';
const DEFAULT_CATEGORIES = ['Bedsheets', 'Sarees', 'Blankets', 'Towels'];

export async function getCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from(CATEGORIES_TABLE)
      .select('name')
      .order('name', { ascending: true });

    if (error) {
      console.warn("Could not load categories from DB, using defaults:", error.message);
      return DEFAULT_CATEGORIES;
    }
    
    if (!data || data.length === 0) {
      return DEFAULT_CATEGORIES;
    }
    
    return data.map((c: any) => c.name);
  } catch (err) {
    console.error("Error loading categories:", err);
    return DEFAULT_CATEGORIES;
  }
}

export async function createCategory(name: string): Promise<void> {
  const { error } = await supabase
    .from(CATEGORIES_TABLE)
    .insert([{ name }]);

  if (error) throw error;
}

export async function deleteCategory(name: string): Promise<void> {
  const { error } = await supabase
    .from(CATEGORIES_TABLE)
    .delete()
    .eq('name', name);

  if (error) throw error;
}
