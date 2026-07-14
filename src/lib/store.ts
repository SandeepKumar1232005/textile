import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { Product } from '../types';

const PRODUCTS_COLLECTION = 'products';

export async function getProducts(): Promise<Product[]> {
  const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Product));
}

export async function getProduct(id: string): Promise<Product | null> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product;
  }
  return null;
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...product,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
}

export function buildWhatsAppLink(product: Product, ownerPhone: string) {
  const message = `Hello Madhumitha Tex,
I am interested in this product.

Product: ${product.name}
Color: ${product.colorCombination}
Price: ₹${product.price}

Please share more details.`;

  // remove any non-digit chars from phone just in case, except '+'
  const phone = ownerPhone.replace(/[^\d+]/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
