import { Link } from 'react-router-dom';
import { Phone, MapPin, Instagram, Facebook, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-12 pb-8 border-t border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Madhumitha Tex Logo" className="w-10 h-10 object-contain rounded-sm" />
              <div className="flex flex-col">
                <span className="text-xl font-semibold tracking-wide uppercase leading-none text-white">Madhumitha Tex</span>
                <span className="text-[10px] tracking-[0.2em] text-[#B8912F] font-medium uppercase mt-2">Quality Home Textiles</span>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/madhumitha_tex_?igsh=N3dnbGxyamEzcTQy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#B8912F] transition-colors" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/share/19L9HeFonC/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#B8912F] transition-colors" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="mailto:owner@madhumithatex.com" className="text-gray-400 hover:text-[#B8912F] transition-colors" title="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-[#B8912F] mb-4 uppercase text-[10px] tracking-[0.2em]">Quick Links</h3>
            <ul className="space-y-3 text-[13px] font-medium uppercase tracking-wider text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Collection</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors text-[11px] opacity-75">Admin Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-[#B8912F] mb-4 uppercase text-[10px] tracking-[0.2em]">Contact Us</h3>
            <ul className="space-y-4 text-[13px] tracking-wider text-gray-400 uppercase">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#B8912F] shrink-0 mt-0.5" />
                <span className="leading-relaxed">256, J.J. Nagar, Karavalasu,<br/>Vazhaithottam (Po), Sivagiri,<br/>Erode - 638109</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#B8912F] shrink-0" />
                <a href="tel:+919952319263" className="hover:text-white transition-colors">+91 99523 19263</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#B8912F]">&copy; {new Date().getFullYear()} Madhumitha Tex.</p>
        </div>
      </div>
    </footer>
  );
}
