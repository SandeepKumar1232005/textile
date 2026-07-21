import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { buildWhatsAppLink } from '../lib/store';
import { useProductDetail, useRelatedProducts } from '../hooks/useProducts';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { PriceDisplay, DiscountBadge } from '../components/PriceDisplay';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';
import { ArrowLeft, MessageCircle, Phone, ChevronLeft, ChevronRight } from 'lucide-react';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading: loading } = useProductDetail(id);
  const { data: relatedProducts = [], isLoading: loadingRelated } = useRelatedProducts(product?.category, product?.id);
  const [activeImage, setActiveImage] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Reset active image when product changes
  useEffect(() => {
    setActiveImage(0);
    window.scrollTo(0, 0);
  }, [id]);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [relatedProducts]);

  useEffect(() => {
    if (!isHovered && relatedProducts.length > 0) {
      const interval = setInterval(() => {
        if (carouselRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
          if (scrollLeft < scrollWidth - clientWidth - 1) {
            carouselRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
          } else {
            carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          }
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered, relatedProducts]);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="w-24 h-6 bg-gray-200 rounded mb-8"></div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-[4/5] bg-gray-200 rounded-lg"></div>
          <div className="space-y-4 pt-4">
            <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
            <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
            <div className="h-6 bg-gray-200 w-1/3 rounded"></div>
            <div className="h-24 bg-gray-200 w-full rounded mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-brand-black mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you are looking for does not exist.</p>
        <Link to="/products" className="px-6 py-2 bg-brand-black text-white rounded-sm font-medium hover:bg-gray-800 transition-colors">
          Back to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="bg-[#FAFAF8] border-b border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 py-4">
          <Link to="/products" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#6E1F2B] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Collection
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="aspect-[4/5] bg-[#FAFAF8] border border-[#EAEAEA] relative overflow-hidden flex items-center justify-center text-gray-300">
              {product.images && product.images[activeImage] ? (
                <img 
                  src={product.images[activeImage]} 
                  alt={product.name}
                  loading="eager"
                  decoding="async"
                  width={600}
                  height={750}
                  className="w-full h-full object-contain transition-transform duration-500 ease-out hover:scale-[1.04]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">No Image Available</div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 w-20 h-24 border transition-colors snap-center ${activeImage === idx ? 'border-[#B8912F]' : 'border-[#EAEAEA] hover:border-gray-300'}`}
                  >
                    <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            className="pt-2 md:pt-8 flex flex-col"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
          >
            <div className="text-[10px] text-[#B8912F] font-bold mb-4 uppercase tracking-[0.2em]">{product.category}</div>
            <h1 className="text-3xl md:text-4xl font-medium text-brand-black mb-4 leading-[1.1] tracking-tight">{product.name}</h1>
            <div className="mb-8">
              <PriceDisplay 
                sellingPrice={product.sellingPrice ?? product.price} 
                originalPrice={product.originalPrice} 
                size="lg" 
              />
            </div>

            <div className="space-y-0 mb-8 text-[13px] border-t border-[#EAEAEA]">
              <div className="grid grid-cols-3 py-4 border-b border-[#EAEAEA]">
                <span className="text-gray-500 uppercase tracking-wider font-medium">Color</span>
                <span className="col-span-2 text-brand-black">{product.colorCombination || '-'}</span>
              </div>
              <div className="grid grid-cols-3 py-4 border-b border-[#EAEAEA]">
                <span className="text-gray-500 uppercase tracking-wider font-medium">Material</span>
                <span className="col-span-2 text-brand-black">{product.material || '-'}</span>
              </div>
              {product.size && (
                <div className="grid grid-cols-3 py-4 border-b border-[#EAEAEA]">
                  <span className="text-gray-500 uppercase tracking-wider font-medium">Size</span>
                  <span className="col-span-2 text-brand-black">{product.size}</span>
                </div>
              )}
              <div className="grid grid-cols-3 py-4 border-b border-[#EAEAEA] items-center">
                <span className="text-gray-500 uppercase tracking-wider font-medium">Availability</span>
                <span className="col-span-2">
                  {product.stockStatus === 'in_stock' && <span className="text-[#25D366] font-bold uppercase tracking-widest text-[11px]">In Stock</span>}
                  {product.stockStatus === 'limited' && <span className="text-[#6E1F2B] font-bold uppercase tracking-widest text-[11px]">Limited</span>}
                  {product.stockStatus === 'out_of_stock' && <span className="text-gray-500 font-bold uppercase tracking-widest text-[11px]">Sold Out</span>}
                </span>
              </div>
            </div>

            <div className="mb-10 text-[15px] leading-relaxed text-[#4A4A4A]">
              <p>{product.description}</p>
            </div>

            <div className="mt-auto flex flex-col sm:flex-row gap-3">
              <a 
                href={buildWhatsAppLink(product, product.ownerPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 border border-[#25D366] text-[#25D366] font-medium uppercase tracking-wide text-sm flex items-center justify-center gap-2 hover:bg-[#25D366] hover:text-white transition-all"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg> Order via WhatsApp
              </a>
              <a 
                href={`tel:${product.ownerPhone.replace(/[^\d+]/g, '')}`}
                className="flex-1 py-4 bg-[#1A1A1A] text-white font-medium uppercase tracking-wide text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                <Phone className="w-4 h-4" /> Call Now
              </a>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {loadingRelated ? (
          <div className="mt-24 pt-12 border-t border-[#EAEAEA]">
            <h2 className="text-2xl font-medium tracking-tight text-brand-black mb-8">Related Products</h2>
            <ProductCardSkeleton count={4} layout="carousel" columns="flex gap-4 md:gap-8 overflow-hidden" />
          </div>
        ) : relatedProducts.length > 0 ? (
          <motion.div
            className="mt-24 pt-12 border-t border-[#EAEAEA]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-medium tracking-tight text-brand-black">Related Products</h2>
              <div className="hidden md:flex items-center gap-2">
                <button 
                  onClick={() => scroll('left')} 
                  disabled={!canScrollLeft}
                  className="w-10 h-10 rounded-full border border-[#EAEAEA] flex items-center justify-center text-gray-500 hover:text-brand-black hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scroll('right')} 
                  disabled={!canScrollRight}
                  className="w-10 h-10 rounded-full border border-[#EAEAEA] flex items-center justify-center text-gray-500 hover:text-brand-black hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div 
              ref={carouselRef}
              onScroll={checkScroll}
              className="flex gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {relatedProducts.map((p, index) => (
                <div 
                  key={p.id}
                  className="snap-start shrink-0 w-[calc(85vw-1rem)] sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-1.5rem)]"
                >
                  <Link 
                    to={`/product/${p.id}`}
                    className="group block cursor-pointer"
                  >
                    <div className="aspect-[4/5] bg-[#FAFAF8] border border-[#EAEAEA] mb-4 relative overflow-hidden flex items-center justify-center text-gray-300 rounded-lg md:rounded-none">
                      {Boolean(p.originalPrice && p.originalPrice > (p.sellingPrice ?? p.price)) && (
                        <div className="absolute top-4 right-4 z-10">
                          <DiscountBadge originalPrice={p.originalPrice} sellingPrice={p.sellingPrice ?? p.price} />
                        </div>
                      )}
                      {p.stockStatus === 'limited' && (
                        <div 
                          style={{ color: '#ffffff', backgroundColor: '#6E1F2B' }}
                          className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest z-10"
                        >
                          Limited
                        </div>
                      )}
                      {p.stockStatus === 'in_stock' && (
                        <div 
                          style={{ color: '#166534', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', borderWidth: '1px', borderStyle: 'solid' }}
                          className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest z-10"
                        >
                          In Stock
                        </div>
                      )}
                      {p.stockStatus === 'out_of_stock' && (
                        <div 
                          style={{ color: '#4b5563', backgroundColor: '#f3f4f6', borderColor: '#e5e7eb', borderWidth: '1px', borderStyle: 'solid' }}
                          className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest z-10"
                        >
                          Sold Out
                        </div>
                      )}

                      {p.images && p.images[0] ? (
                        <img 
                          src={p.images[0]} 
                          alt={p.name}
                          loading="lazy"
                          decoding="async"
                          width={400}
                          height={500}
                          className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                      )}
                    </div>
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-1">
                        <h3 className="font-medium text-brand-black line-clamp-1">{p.name}</h3>
                        <PriceDisplay 
                          sellingPrice={p.sellingPrice ?? p.price} 
                          originalPrice={p.originalPrice} 
                          size="sm" 
                          showDiscountBadge={false}
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
