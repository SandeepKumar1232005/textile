import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from './supabase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price)
}

export function resizeImageFile(file: File, maxWidth = 1000, maxHeight = 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress heavily to keep firestore docs small
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}

// ---------------------------------------------------------------------------
// Supabase Storage helpers — upload images as compressed WebP to a public bucket
// ---------------------------------------------------------------------------

const STORAGE_BUCKET = 'product-images';

/** Resize an image File to a compressed WebP Blob (much smaller than base64). */
function resizeToBlob(file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.75): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
        } else {
          if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Prefer WebP, fall back to JPEG
        canvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
          'image/webp',
          quality,
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Upload an image File to Supabase Storage and return the public URL.
 * Images are resized and compressed to WebP before upload.
 */
export async function uploadImageToStorage(file: File): Promise<string> {
  const blob = await resizeToBlob(file);
  const ext = 'webp';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, blob, { contentType: 'image/webp', upsert: false });

  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data: publicData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return publicData.publicUrl;
}

/**
 * Delete an image from Supabase Storage by its public URL.
 * Silently ignores errors (image may already be deleted or be legacy base64).
 */
export async function deleteImageFromStorage(publicUrl: string): Promise<void> {
  try {
    // Extract the path after the bucket name
    const marker = `/${STORAGE_BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return; // Not a Storage URL (possibly legacy base64)
    const filePath = publicUrl.slice(idx + marker.length);

    await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
  } catch {
    // Best-effort deletion — don't block the caller
  }
}

/** Check if a string looks like a base64 data URL (legacy image). */
export function isBase64Image(url: string): boolean {
  return url.startsWith('data:');
}

