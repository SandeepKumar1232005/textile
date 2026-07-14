export interface Product {
  id: string;
  name: string;              // e.g. type of fabric
  category: string;          // Powerloom | Cotton | Printed | Saree | Dress Material ...
  colorCombination: string;  // e.g. "Rose + Light Green"
  material: string;
  price: number;
  description: string;
  images: string[];          // Cloudinary/Storage URLs or Base64, multiple allowed
  stockStatus: "in_stock" | "limited" | "out_of_stock";
  quantity?: number;         // optional
  ownerPhone: string;        // WhatsApp order number
  size?: string;             // e.g. "Double", "6x7 feet", "Standard Saree Size"
  createdAt: Date | string | number;
  updatedAt: Date | string | number;
}
