import { supabase } from './supabase';
import { Product } from '../types';

const PRODUCTS_TABLE = 'products';

// Map database snake_case to frontend camelCase
function mapProductFromDb(data: any): Product {
  const sellingPrice = data.selling_price !== undefined && data.selling_price !== null && data.selling_price !== ''
    ? Number(data.selling_price)
    : Number(data.price || 0);

  const originalPrice = data.original_price !== undefined && data.original_price !== null && data.original_price !== ''
    ? Number(data.original_price)
    : undefined;

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    price: sellingPrice,
    sellingPrice: sellingPrice,
    originalPrice: originalPrice,
    colorCombination: data.color_combination || '',
    material: data.material || '',
    description: data.description || '',
    images: data.images || [],
    stockStatus: data.stock_status,
    ownerPhone: data.owner_phone,
    size: data.size || '',
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
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
  if (product.originalPrice !== undefined) {
    data.original_price = product.originalPrice && Number(product.originalPrice) > 0 
      ? Number(product.originalPrice) 
      : null;
  }

  if (product.colorCombination !== undefined) data.color_combination = product.colorCombination;
  if (product.material !== undefined) data.material = product.material;
  if (product.description !== undefined) data.description = product.description;
  if (product.images !== undefined) data.images = product.images;
  if (product.stockStatus !== undefined) data.stock_status = product.stockStatus;
  if (product.ownerPhone !== undefined) data.owner_phone = product.ownerPhone;
  if (product.size !== undefined) data.size = product.size;
  return data;
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapProductFromDb);
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapProductFromDb(data) : null;
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const dbData = mapProductToDb(product);
  
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .insert([dbData])
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
  const dbData = mapProductToDb(updates);
  dbData.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from(PRODUCTS_TABLE)
    .update(dbData)
    .eq('id', id);

  if (error) throw error;
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

