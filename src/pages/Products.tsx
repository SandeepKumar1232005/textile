import { Link, useSearchParams } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { getProducts, getCategories } from '../lib/store';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('');

  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    async function load() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(['All', ...categoriesData]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, sortBy, products]);

  return (
    <div className="min-h-screen bg-white max-w-7xl mx-auto px-4 sm:px-10 py-10">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-medium text-brand-black tracking-tight mb-8">Our Collection</h1>
        
        {/* Sticky Search & Filters */}
        <div className="sticky top-16 z-40 bg-white py-4 border-b border-[#EAEAEA] flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" strokeWidth={2} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#EAEAEA] focus:outline-none focus:border-brand-black bg-[#FAFAF8] text-sm"
            />
          </div>
          <div className="flex gap-4">
            <select 
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSearchParams(e.target.value && e.target.value !== 'All' ? { category: e.target.value } : {});
              }}
              className="border border-[#EAEAEA] py-3 px-4 focus:outline-none focus:border-brand-black bg-[#FAFAF8] font-medium text-sm"
            >
              {categories.map(cat => <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>)}
            </select>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-[#EAEAEA] py-3 px-4 focus:outline-none focus:border-brand-black bg-[#FAFAF8] font-medium text-sm"
            >
              <option value="">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="aspect-[4/5] bg-gray-100 border border-[#EAEAEA]" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: Math.min(index % 4, 3) * 0.04, ease: 'easeOut' }}
            >
              <Link 
                to={`/product/${product.id}`}
                className="group block cursor-pointer"
              >
                <div className="aspect-[4/5] bg-[#FAFAF8] border border-[#EAEAEA] mb-4 relative overflow-hidden flex items-center justify-center text-gray-300">
                  {product.stockStatus === 'limited' && (
                    <div className="absolute top-4 right-4 bg-[#6E1F2B] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest z-10">Limited</div>
                  )}
                  {product.stockStatus === 'in_stock' && (
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-[#EAEAEA] z-10">In Stock</div>
                  )}
                  {product.stockStatus === 'out_of_stock' && (
                    <div className="absolute top-4 left-4 bg-gray-200 text-gray-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-[#EAEAEA] z-10">Sold Out</div>
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
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-medium text-brand-black line-clamp-1">{product.name}</h3>
                    <span className="text-[#6E1F2B] font-semibold">{formatPrice(product.price)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-tighter">{product.category} {product.material ? `• ${product.material}` : ''}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#FAFAF8] border border-[#EAEAEA]">
          <img src="/logo.png" alt="Madhumitha Tex Logo" className="w-16 h-16 object-contain mx-auto mb-6 rounded-sm grayscale opacity-50" />
          <h3 className="text-xl font-medium text-brand-black mb-2">
            {selectedCategory ? `${selectedCategory} Collection Coming Soon` : 'No products found'}
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {selectedCategory 
              ? 'We are currently weaving fabrics for this collection. Please check back soon!'
              : "We couldn't find any products matching your current filters. Try adjusting your search or category."}
          </p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory(''); setSortBy(''); }}
            className="mt-6 px-8 py-3 bg-brand-black text-white font-medium hover:bg-gray-800 transition-colors uppercase tracking-wide text-sm"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
