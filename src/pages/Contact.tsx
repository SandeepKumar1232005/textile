import { Phone, MapPin, Mail, Instagram, MessageCircle } from 'lucide-react';

export function Contact() {
  return (
    <div className="min-h-screen bg-white max-w-7xl mx-auto px-4 sm:px-10 py-20">
      <h1 className="text-4xl md:text-5xl font-medium leading-[1.1] text-brand-black mb-16 tracking-tight">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
        <div className="space-y-12">
          <div>
            <h2 className="text-[10px] text-[#B8912F] font-bold mb-4 uppercase tracking-[0.2em]">Get in Touch</h2>
            <p className="text-[#4A4A4A] leading-relaxed text-[15px] mb-8">
              We'd love to hear from you. For bulk orders or any inquiries about our powerloom fabrics, please reach out to us.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-6 p-6 bg-[#FAFAF8] border border-[#EAEAEA]">
              <div className="text-[#B8912F] shrink-0 mt-1">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[10px] text-[#B8912F] font-bold mb-2 uppercase tracking-[0.2em]">Our Location</h3>
                <p className="text-[14px] leading-relaxed text-[#4A4A4A]">123 Textile Market Road,<br />Erode, Tamil Nadu 638001</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-[#FAFAF8] border border-[#EAEAEA]">
              <div className="text-[#25D366] shrink-0 mt-1">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[10px] text-[#B8912F] font-bold mb-2 uppercase tracking-[0.2em]">WhatsApp Us</h3>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-[14px] text-brand-black font-medium hover:text-[#25D366] transition-colors inline-block mb-1">+91 98765 43210</a>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Fastest response time</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-[#FAFAF8] border border-[#EAEAEA]">
              <div className="text-brand-black shrink-0 mt-1">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[10px] text-[#B8912F] font-bold mb-2 uppercase tracking-[0.2em]">Call Us</h3>
                <a href="tel:+919876543210" className="text-[14px] text-brand-black font-medium hover:text-[#B8912F] transition-colors inline-block mb-1">+91 98765 43210</a>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Mon-Sat, 9AM to 8PM</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-[#FAFAF8] border border-[#EAEAEA]">
              <div className="text-brand-black shrink-0 mt-1">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[10px] text-[#B8912F] font-bold mb-2 uppercase tracking-[0.2em]">Follow Us</h3>
                <a href="#" className="text-[14px] text-brand-black font-medium hover:text-[#B8912F] transition-colors">@madhumitha.tex</a>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[500px] bg-[#FAFAF8] border border-[#EAEAEA] relative overflow-hidden">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1m2!1s0x3ba9a6f3b06297e5%3A0xc0fb1f2c253d7125!2sErode%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1715000000000!5m2!1sen!2sin" 
            className="absolute inset-0 w-full h-full border-0 grayscale opacity-90 mix-blend-multiply" 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
