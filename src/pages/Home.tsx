import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { getProducts, getCategories } from '../lib/store';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setFeaturedProducts(productsData.slice(0, 4));
        setAllProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative bg-[#FAFAF8] bg-cover bg-no-repeat bg-center md:bg-[right_center] border-b border-[#EAEAEA] flex items-center hero-section"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-white/50 md:bg-white/20 z-0"></div>

        <div className="relative max-w-7xl mx-auto w-full z-10 px-6 md:px-10 py-14 md:py-32">
          <div className="max-w-xl md:max-w-2xl">
            <motion.div
              className="mb-3 md:mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <span className="text-[#B8912F] text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] md:tracking-[0.3em] mb-3 md:mb-4 block">Collection 2024</span>
              <h1 className="hero-heading font-semibold leading-[1.15] text-brand-black mb-4 md:mb-6 tracking-tight">Style & Comfort for Every Home</h1>
              <p className="text-[#4A4A4A] leading-[1.6] mb-6 md:mb-8 text-[15px] md:text-[15px] max-w-md md:max-w-lg font-medium">
                Discover premium bedsheets and home textiles crafted for everyday comfort. Quality materials, elegant designs, and lasting durability for every home.
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.15 }}
            >
              <Link 
                to="/products" 
                className="w-full sm:w-auto bg-[#6E1F2B] text-white px-7 md:px-8 h-12 md:h-[52px] text-[13px] md:text-sm font-medium tracking-wide uppercase flex items-center justify-center rounded-[11px] md:rounded-none active:scale-[0.98] hover:opacity-90 transition-all"
              >
                Browse Full Collection
              </Link>
              <a 
                href="https://wa.me/919952319263?text=Hello%20Madhumitha%20Tex,%20I%20would%20like%20to%20know%20more%20about%20your%20fabrics."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto border border-[#25D366] text-[#25D366] px-7 md:px-8 h-12 md:h-[52px] bg-white/80 text-[13px] md:text-sm font-medium tracking-wide uppercase flex items-center justify-center gap-2 rounded-[11px] md:rounded-none active:scale-[0.98] hover:bg-[#25D366] hover:text-white transition-all"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </motion.div>
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex gap-2.5 mt-8 md:mt-24">
            <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#B8912F]"></span>
            <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border border-gray-400"></span>
            <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border border-gray-400"></span>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <motion.section
        className="pt-8 md:pt-16 pb-10 md:pb-16 px-6 md:px-10 max-w-7xl mx-auto w-full bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="flex items-baseline justify-between mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-medium tracking-tight text-brand-black">Featured Collection</h2>
          <Link to="/products" className="text-xs font-semibold text-[#B8912F] underline underline-offset-4 transition-colors hover:text-brand-black">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[4/5] bg-gray-100 border border-[#EAEAEA] rounded-lg md:rounded-none" />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.06, ease: 'easeOut' }}
              >
                <Link 
                  to={`/product/${product.id}`}
                  className="group block cursor-pointer"
                >
                  <div className="aspect-[4/5] bg-[#FAFAF8] border border-[#EAEAEA] mb-3 md:mb-4 relative overflow-hidden flex items-center justify-center text-gray-300 rounded-lg md:rounded-none">
                    {product.stockStatus === 'limited' && (
                      <div 
                        style={{ color: '#ffffff', backgroundColor: '#6E1F2B' }}
                        className="absolute top-4 right-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest z-10"
                      >
                        Limited
                      </div>
                    )}
                    {product.stockStatus === 'in_stock' && (
                      <div 
                        style={{ color: '#166534', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', borderWidth: '1px', borderStyle: 'solid' }}
                        className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest z-10"
                      >
                        In Stock
                      </div>
                    )}
                    {product.stockStatus === 'out_of_stock' && (
                      <div 
                        style={{ color: '#4b5563', backgroundColor: '#f3f4f6', borderColor: '#e5e7eb', borderWidth: '1px', borderStyle: 'solid' }}
                        className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest z-10"
                      >
                        Sold Out
                      </div>
                    )}

                    {product.images && product.images[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        loading="lazy"
                        className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 bg-[#FAFAF8]">No Image</div>
                    )}
                  </div>
                  <div className="px-0.5 md:px-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm md:text-lg font-medium text-brand-black line-clamp-1">{product.name}</h3>
                      <span className="text-[#6E1F2B] text-sm md:text-base font-semibold ml-2 shrink-0">{formatPrice(product.price)}</span>
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1 uppercase tracking-tighter">{product.category} {product.material ? `• ${product.material}` : ''}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-brand-offwhite border border-[#EAEAEA]">
            <img src="/logo.png" alt="Madhumitha Tex Logo" className="w-12 h-12 object-contain mx-auto mb-4 rounded-sm grayscale opacity-50" />
            <p className="text-gray-500 font-medium">No products currently available.</p>
          </div>
        )}
      </motion.section>

      {/* Categories */}
      <motion.section
        className="bg-[#FAFAF8] py-10 md:py-16 px-6 md:px-10 border-t border-[#EAEAEA]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl md:text-2xl font-medium text-brand-black mb-6 md:mb-8 text-center tracking-tight">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {categories.map((category, index) => {
              const hasProducts = allProducts.some(p => p.category === category);
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
                >
                  {hasProducts ? (
                    <Link 
                      to={`/products?category=${category}`}
                      className="block bg-white py-8 px-6 border border-[#EAEAEA] text-center hover:border-brand-gold transition-colors"
                    >
                      <h3 className="font-semibold text-brand-black uppercase tracking-wider text-sm">{category}</h3>
                    </Link>
                  ) : (
                    <div className="bg-white py-8 px-6 border border-[#EAEAEA] text-center relative opacity-80">
                      <h3 className="font-medium text-gray-400 uppercase tracking-wider text-sm mb-1">{category}</h3>
                      <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest block">Coming Soon</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
