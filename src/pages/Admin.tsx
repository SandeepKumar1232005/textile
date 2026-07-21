import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories, createCategory, deleteCategory } from '../lib/store';
import { Product } from '../types';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, LogOut, Sparkles } from 'lucide-react';
import { formatPrice, resizeImageFile } from '../lib/utils';
import { PriceDisplay } from '../components/PriceDisplay';

export function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [aiParsing, setAiParsing] = useState(false);

  // Category Management states
  const [showCategoryMgr, setShowCategoryMgr] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      } else if (session.user.email !== 'owner@madhumithatex.com') {
        supabase.auth.signOut();
        navigate('/login');
        alert('Access denied: Only the owner account can manage products.');
      } else {
        setUser(session.user);
        loadData();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      } else if (session.user.email !== 'owner@madhumithatex.com') {
        supabase.auth.signOut();
        navigate('/login');
        alert('Access denied: Only the owner account can manage products.');
      } else {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  async function loadData() {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct || !currentProduct.name) return;
    
    const sellingPrice = Number(currentProduct.sellingPrice ?? currentProduct.price ?? 0);
    let originalPrice = currentProduct.originalPrice !== undefined && currentProduct.originalPrice !== null && currentProduct.originalPrice !== ('' as any)
      ? Number(currentProduct.originalPrice)
      : undefined;

    if (!sellingPrice || sellingPrice <= 0) {
      alert('Selling Price is mandatory and must be greater than 0.');
      return;
    }

    // If Original Price is less than or equal to Selling Price, ignore originalPrice on save so it doesn't block saving
    if (originalPrice !== undefined && originalPrice <= sellingPrice) {
      originalPrice = undefined;
    }

    const payload = {
      ...currentProduct,
      sellingPrice,
      price: sellingPrice,
      originalPrice: originalPrice && originalPrice > sellingPrice ? originalPrice : undefined,
    };
    
    try {
      if (currentProduct.id) {
        await updateProduct(currentProduct.id, payload);
      } else {
        await createProduct(payload as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
      }
      setIsEditing(false);
      setCurrentProduct(null);
      loadData();
    } catch (err: any) {
      console.error(err);
      alert('Error saving product: ' + (err?.message || err?.details || err));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        loadData();
      } catch (err) {
        console.error(err);
        alert('Error deleting product');
      }
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    try {
      await createCategory(name);
      setNewCategoryName('');
      loadData();
      alert(`Category "${name}" successfully added!`);
    } catch (err: any) {
      console.error(err);
      alert('Error adding category. Please ensure the "categories" table is created in your Supabase database.');
    }
  };

  const handleDeleteCategory = async (name: string) => {
    if (confirm(`Are you sure you want to delete the category "${name}"? Products in this category will not be deleted but they will no longer show under this category.`)) {
      try {
        await deleteCategory(name);
        loadData();
      } catch (err: any) {
        console.error(err);
        alert('Error deleting category: ' + (err.message || err));
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    try {
      const newImages = [...(currentProduct?.images || [])];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const base64 = await resizeImageFile(file);
        newImages.push(base64);
      }
      setCurrentProduct({ ...currentProduct, images: newImages });
    } catch (err) {
      console.error(err);
      alert('Error processing image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAiAutoFill = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setAiParsing(true);
    try {
      const base64Image = await resizeImageFile(file);
      
      const match = base64Image.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
      if (!match) {
        throw new Error('Invalid image format');
      }
      const mimeType = match[1];
      const base64Data = match[2];

      const apiKey = (process.env as any).GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured in .env.local');
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                  }
                },
                {
                  text: `This is an image of a textile product, label, invoice, or handwritten note about a product.
Please extract the following details from it, if present. Respond ONLY with a valid JSON object matching this schema:
{
  "name": "string (The name of the product/fabric, e.g. 'lightweight powerloom')",
  "colorCombination": "string (Colors or pechits, e.g. 'Rose + Light Green')",
  "originalPrice": "number (Original price / MRP of the product if listed or crossed out, e.g. 999)",
  "sellingPrice": "number (Selling price / current price of the product, e.g. 699)",
  "ownerPhone": "string (Phone/WhatsApp contact number, e.g. '9952319263' or '+919952319263')",
  "category": "string (Must be exactly one of: ${categories.map(c => `'${c}'`).join(', ')})",
  "material": "string (e.g. 'Cotton', 'Silk', etc.)",
  "size": "string (e.g. 'Double Bedsheet (90x100 inches)', '6.3m', etc. if present)",
  "description": "string (A brief 1-2 sentence description summarizing the product details)"
}
Return only the raw JSON. Do not write markdown, code blocks (such as \`\`\`json), or explanations.`
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('No content returned from Gemini API');
      }

      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanText);

      setCurrentProduct(prev => {
        const parsedSellingPrice = typeof data.sellingPrice === 'number'
          ? data.sellingPrice
          : (Number(data.sellingPrice) || (typeof data.price === 'number' ? data.price : Number(data.price)) || prev?.sellingPrice || prev?.price || 0);

        const parsedOriginalPrice = typeof data.originalPrice === 'number'
          ? data.originalPrice
          : (Number(data.originalPrice) || prev?.originalPrice);

        return {
          ...prev,
          name: data.name || prev?.name || '',
          colorCombination: data.colorCombination || prev?.colorCombination || '',
          sellingPrice: parsedSellingPrice,
          price: parsedSellingPrice,
          originalPrice: parsedOriginalPrice,
          ownerPhone: data.ownerPhone || prev?.ownerPhone || '+919952319263',
          category: categories.includes(data.category) 
            ? data.category 
            : prev?.category || categories[0] || 'Bedsheets',
          material: data.material || prev?.material || '',
          size: data.size || prev?.size || '',
          description: data.description || prev?.description || '',
          images: [...(prev?.images || []), base64Image]
        };
      });

      alert('✨ AI successfully auto-filled product details from the image!');
    } catch (err: any) {
      console.error(err);
      alert(`AI Auto-fill failed: ${err.message || err}`);
    } finally {
      setAiParsing(false);
      e.target.value = '';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-brand-black text-white px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-gold text-brand-white flex items-center justify-center rounded-sm text-sm">M</div>
            Admin Dashboard
          </h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isEditing ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-brand-black">{showCategoryMgr ? 'Categories' : 'Products'}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {showCategoryMgr ? `Total: ${categories.length} categories` : `Total: ${products.length} items`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCategoryMgr(!showCategoryMgr)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-sm font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  {showCategoryMgr ? 'View Products' : 'Manage Categories'}
                </button>
                {!showCategoryMgr && (
                  <button 
                    onClick={() => {
                      setCurrentProduct({
                        category: categories[0] || 'Bedsheets',
                        stockStatus: 'in_stock',
                        images: [],
                        ownerPhone: '+919952319263' // Default
                      });
                      setIsEditing(true);
                    }}
                    className="px-4 py-2 bg-brand-black text-white rounded-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading details...</div>
            ) : showCategoryMgr ? (
              <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-200 max-w-2xl">
                <h3 className="text-base font-semibold text-brand-black mb-4">Add New Category</h3>
                <form onSubmit={handleAddCategory} className="flex gap-3 mb-8">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Blankets"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    className="flex-grow px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-brand-black text-sm"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-brand-black text-white rounded-sm font-medium hover:bg-gray-800 transition-colors text-sm"
                  >
                    Add Category
                  </button>
                </form>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Current Categories</h4>
                  <div className="divide-y divide-gray-100 border border-gray-100 rounded-sm bg-white">
                    {categories.length === 0 ? (
                      <p className="p-4 text-sm text-gray-500">No categories created yet.</p>
                    ) : (
                      categories.map(cat => (
                        <div key={cat} className="flex justify-between items-center p-4">
                          <span className="font-medium text-brand-black">{cat}</span>
                          <button
                            onClick={() => handleDeleteCategory(cat)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 tracking-wider">
                        <th className="p-4 font-medium">Image</th>
                        <th className="p-4 font-medium">Name</th>
                        <th className="p-4 font-medium">Category</th>
                        <th className="p-4 font-medium">Price</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                              {p.images && p.images[0] ? (
                                <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-gray-300 m-auto mt-3" />
                              )}
                            </div>
                          </td>
                          <td className="p-4 font-medium text-brand-black">{p.name}</td>
                          <td className="p-4 text-gray-600">{p.category}</td>
                          <td className="p-4 text-brand-maroon font-medium">
                            <PriceDisplay 
                              sellingPrice={p.sellingPrice ?? p.price} 
                              originalPrice={p.originalPrice} 
                              size="sm" 
                            />
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              p.stockStatus === 'in_stock' ? 'bg-green-100 text-green-800' : 
                              p.stockStatus === 'limited' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {p.stockStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button onClick={() => { setCurrentProduct(p); setIsEditing(true); }} className="text-blue-600 hover:text-blue-800 p-1">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800 p-1">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-500">No products found. Add your first product!</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-200 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-brand-black">{currentProduct?.id ? 'Edit Product' : 'Add New Product'}</h2>
                {!currentProduct?.id && (
                  <p className="text-xs text-gray-500 mt-0.5">Fill manually or use AI to extract from an image</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {!currentProduct?.id && (
                  <label className="flex items-center gap-2 px-3 py-1.5 bg-brand-gold text-white text-xs font-semibold rounded-sm cursor-pointer hover:bg-[#a68026] transition-colors shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    {aiParsing ? 'AI Extracting...' : 'Auto-fill from Image'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAiAutoFill} 
                      disabled={aiParsing} 
                    />
                  </label>
                )}
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {aiParsing && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-sm text-sm flex items-center gap-3 animate-pulse">
                <Sparkles className="w-5 h-5 text-brand-gold shrink-0" />
                <div>
                  <span className="font-semibold block">Gemini AI is analyzing the image...</span>
                  <span>Extracting name, price, colors, and WhatsApp number. This takes about 2-3 seconds.</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-black mb-1">Product Name *</label>
                  <input 
                    type="text" required
                    value={currentProduct?.name || ''}
                    onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-brand-black"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1">Category *</label>
                  <select 
                    required
                    value={currentProduct?.category || categories[0] || 'Bedsheets'}
                    onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-brand-black"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1">
                    Original Price (MRP ₹) <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input 
                    type="number" min="0" placeholder="e.g. 999"
                    value={currentProduct?.originalPrice ?? ''}
                    onChange={e => setCurrentProduct({
                      ...currentProduct, 
                      originalPrice: e.target.value === '' ? undefined : Number(e.target.value)
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-brand-black"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1">
                    Selling Price (₹) *
                  </label>
                  <input 
                    type="number" required min="1" placeholder="e.g. 699"
                    value={currentProduct?.sellingPrice ?? currentProduct?.price ?? ''}
                    onChange={e => setCurrentProduct({
                      ...currentProduct, 
                      sellingPrice: Number(e.target.value),
                      price: Number(e.target.value)
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-brand-black"
                  />
                </div>

                {Boolean(
                  currentProduct?.originalPrice && 
                  (currentProduct?.sellingPrice ?? currentProduct?.price) && 
                  Number(currentProduct?.sellingPrice ?? currentProduct?.price) > Number(currentProduct?.originalPrice)
                ) && (
                  <div className="md:col-span-2 p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-base shrink-0">💡</span>
                      <span>
                        Selling price (<strong>₹{currentProduct?.sellingPrice ?? currentProduct?.price}</strong>) is higher than Original Price (MRP <strong>₹{currentProduct?.originalPrice}</strong>).
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setCurrentProduct({ ...currentProduct, originalPrice: undefined })}
                        className="px-2.5 py-1 bg-white border border-amber-300 text-amber-900 rounded-sm text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
                      >
                        Clear MRP
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentProduct({ ...currentProduct, originalPrice: Number(currentProduct?.sellingPrice ?? currentProduct?.price) })}
                        className="px-2.5 py-1 bg-[#6E1F2B] text-white rounded-sm text-xs font-semibold hover:bg-[#581822] transition-colors cursor-pointer"
                      >
                        Set MRP = ₹{currentProduct?.sellingPrice ?? currentProduct?.price}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1">Color Combination</label>
                  <input 
                    type="text" placeholder="e.g. Rose + Light Green"
                    value={currentProduct?.colorCombination || ''}
                    onChange={e => setCurrentProduct({...currentProduct, colorCombination: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-brand-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1">Material</label>
                  <input 
                    type="text" placeholder="e.g. 100% Cotton"
                    value={currentProduct?.material || ''}
                    onChange={e => setCurrentProduct({...currentProduct, material: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-brand-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1">Size</label>
                  <input 
                    type="text" placeholder="e.g. Double Bedsheet (90x100 inches), 6.3m (Saree)"
                    value={currentProduct?.size || ''}
                    onChange={e => setCurrentProduct({...currentProduct, size: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-brand-black"
                  />
                  {currentProduct?.category === 'Bedsheets' && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        'Single (60 × 90 inches)',
                        'Double (90 × 100 inches)',
                        'Queen (90 × 108 inches)',
                        'King (108 × 108 inches)'
                      ].map(sz => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setCurrentProduct({...currentProduct, size: sz})}
                          className={`px-2 py-1 text-[10px] border font-medium rounded-sm transition-colors ${currentProduct.size === sz ? 'bg-brand-black text-white border-brand-black' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1">Stock Status *</label>
                  <select 
                    required
                    value={currentProduct?.stockStatus || 'in_stock'}
                    onChange={e => setCurrentProduct({...currentProduct, stockStatus: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-brand-black"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="limited">Limited</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-black mb-1">WhatsApp Order Number</label>
                  <input 
                    type="text" required
                    value={currentProduct?.ownerPhone || '+919952319263'}
                    onChange={e => setCurrentProduct({...currentProduct, ownerPhone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-brand-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-black mb-1">Description</label>
                  <textarea 
                    rows={4}
                    value={currentProduct?.description || ''}
                    onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-brand-black"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand-black mb-2">Images</label>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    {currentProduct?.images?.map((img, idx) => (
                      <div key={idx} className="relative w-24 h-24 rounded border border-gray-200 overflow-hidden group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => {
                            const newImages = [...(currentProduct.images || [])];
                            newImages.splice(idx, 1);
                            setCurrentProduct({...currentProduct, images: newImages});
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    
                    <label className="w-24 h-24 rounded border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-brand-black hover:border-brand-black cursor-pointer transition-colors">
                      {uploadingImage ? <span className="text-xs">Loading...</span> : (
                        <>
                          <Plus className="w-6 h-6 mb-1" />
                          <span className="text-xs">Add Image</span>
                        </>
                      )}
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">Images are automatically resized and compressed for fast loading.</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 rounded-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploadingImage}
                  className="px-8 py-2 bg-brand-black text-white rounded-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
