import { Link } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-3 sm:py-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <Link to="/" className="flex items-center gap-2.5 md:gap-3">
              <img src="/logo.png" alt="Madhumitha Tex Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-sm bg-black" />
              <div className="flex flex-col">
                <span className="text-base md:text-xl font-semibold tracking-wide uppercase leading-none text-brand-black">Madhumitha Tex</span>
                <span className="text-[9px] md:text-[10px] tracking-[0.15em] md:tracking-[0.2em] text-[#B8912F] font-medium uppercase mt-0.5 md:mt-1">Quality Powerloom Fabrics</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-[13px] font-medium uppercase tracking-wider">
            <Link to="/" className="text-brand-black hover:text-brand-maroon transition-colors">Home</Link>
            <Link to="/products" className="text-brand-black hover:text-brand-maroon transition-colors">Collection</Link>
            <Link to="/about" className="text-brand-black hover:text-brand-maroon transition-colors">About Us</Link>
            <Link to="/contact" className="text-brand-black hover:text-brand-maroon transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/products" className="p-2 rounded-full hover:bg-gray-100 transition-colors text-brand-black" aria-label="Search">
              <Search className="w-5 h-5" strokeWidth={2} />
            </Link>
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors text-brand-black"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" strokeWidth={2} /> : <Menu className="w-5 h-5" strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 top-[57px] z-40 bg-black/20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-[#EAEAEA] bg-white relative z-50 mobile-drawer">
          <div className="px-6 pt-3 pb-5 space-y-0.5">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="block px-2 py-3 text-[13px] font-medium uppercase tracking-wider text-brand-black hover:bg-gray-50 rounded-lg active:bg-gray-100 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              onClick={() => setIsOpen(false)}
              className="block px-2 py-3 text-[13px] font-medium uppercase tracking-wider text-brand-black hover:bg-gray-50 rounded-lg active:bg-gray-100 transition-colors"
            >
              Collection
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsOpen(false)}
              className="block px-2 py-3 text-[13px] font-medium uppercase tracking-wider text-brand-black hover:bg-gray-50 rounded-lg active:bg-gray-100 transition-colors"
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsOpen(false)}
              className="block px-2 py-3 text-[13px] font-medium uppercase tracking-wider text-brand-black hover:bg-gray-50 rounded-lg active:bg-gray-100 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
