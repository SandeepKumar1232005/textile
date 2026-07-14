import { Phone, MapPin, Mail, Instagram, MessageCircle, Facebook } from 'lucide-react';
import { motion } from 'motion/react';

export function Contact() {
  return (
    <div className="min-h-screen bg-white max-w-7xl mx-auto px-4 sm:px-10 py-20">
      <motion.h1
        className="text-4xl md:text-5xl font-medium leading-[1.1] text-brand-black mb-16 tracking-tight"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        Contact Us
      </motion.h1>
      
      <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
        <motion.div
          className="space-y-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div>
            <h2 className="text-[10px] text-[#B8912F] font-bold mb-4 uppercase tracking-[0.2em]">Get in Touch</h2>
            <p className="text-[#4A4A4A] leading-relaxed text-[15px] mb-8">
              We'd love to hear from you. For bulk orders or any inquiries about our powerloom fabrics, please reach out to us.
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                icon: <MapPin className="w-5 h-5" />,
                iconColor: 'text-[#B8912F]',
                label: 'Our Location',
                content: <p className="text-[14px] leading-relaxed text-[#4A4A4A]">256, J.J. Nagar, Karavalasu,<br />Vazhaithottam (Po), Sivagiri,<br />Erode - 638109</p>,
              },
              {
                icon: <MessageCircle className="w-5 h-5" />,
                iconColor: 'text-[#25D366]',
                label: 'WhatsApp Us',
                content: (
                  <>
                    <a href="https://wa.me/919952319263" target="_blank" rel="noopener noreferrer" className="text-[14px] text-brand-black font-medium hover:text-[#25D366] transition-colors inline-block mb-1">+91 99523 19263</a>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider">Fastest response time</p>
                  </>
                ),
              },
              {
                icon: <Phone className="w-5 h-5" />,
                iconColor: 'text-brand-black',
                label: 'Call Us',
                content: (
                  <>
                    <a href="tel:+919952319263" className="text-[14px] text-brand-black font-medium hover:text-[#B8912F] transition-colors inline-block mb-1">+91 99523 19263</a>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider">Mon-Sat, 9AM to 8PM</p>
                  </>
                ),
              },
              {
                icon: <Mail className="w-5 h-5" />,
                iconColor: 'text-brand-black',
                label: 'Email Us',
                content: <a href="mailto:owner@madhumithatex.com" className="text-[14px] text-brand-black font-medium hover:text-[#B8912F] transition-colors">owner@madhumithatex.com</a>,
              },
              {
                icon: <Instagram className="w-5 h-5" />,
                iconColor: 'text-brand-black',
                label: 'Follow Us',
                content: <a href="https://www.instagram.com/madhumitha_tex_?igsh=N3dnbGxyamEzcTQy" target="_blank" rel="noopener noreferrer" className="text-[14px] text-brand-black font-medium hover:text-[#B8912F] transition-colors">@madhumitha_tex_</a>,
              },
              {
                icon: <Facebook className="w-5 h-5" />,
                iconColor: 'text-brand-black',
                label: 'Facebook',
                content: <a href="https://www.facebook.com/share/19L9HeFonC/" target="_blank" rel="noopener noreferrer" className="text-[14px] text-brand-black font-medium hover:text-[#B8912F] transition-colors">Madhumitha Tex</a>,
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="flex items-start gap-6 p-6 bg-[#FAFAF8] border border-[#EAEAEA]"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
              >
                <div className={`${item.iconColor} shrink-0 mt-1`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-[10px] text-[#B8912F] font-bold mb-2 uppercase tracking-[0.2em]">{item.label}</h3>
                  {item.content}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="h-[500px] bg-[#FAFAF8] border border-[#EAEAEA] relative overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1m2!1s0x3ba9a6f3b06297e5%3A0xc0fb1f2c253d7125!2sErode%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1715000000000!5m2!1sen!2sin" 
            className="absolute inset-0 w-full h-full border-0 grayscale opacity-90 mix-blend-multiply" 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map Location"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
}
