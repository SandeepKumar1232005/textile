export function About() {
  return (
    <div className="min-h-screen bg-white max-w-4xl mx-auto px-4 sm:px-10 py-20">
      <div className="mb-16 border-b border-[#EAEAEA] pb-10">
        <h1 className="text-4xl md:text-5xl font-medium leading-[1.1] text-brand-black mb-6 tracking-tight">About Madhumitha Tex</h1>
        <p className="text-[#4A4A4A] leading-relaxed text-[15px] max-w-2xl">Weaving quality into every thread since our inception.</p>
      </div>

      <div className="space-y-12">
        <section className="text-[15px] leading-relaxed text-[#4A4A4A] space-y-6">
          <p>
            Welcome to Madhumitha Tex, a locally rooted textile business specializing in premium powerloom fabrics. Based in Erode—the heart of Tamil Nadu's textile industry—we pride ourselves on delivering authentic, durable, and beautifully crafted textiles to our customers.
          </p>
          <p>
            What started as a small weaving unit has grown into a trusted name for wholesalers, boutique owners, and direct buyers who value quality. We understand that every fabric tells a story, and our goal is to ensure that your story is woven with the finest materials and utmost care.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mt-16 pt-16 border-t border-[#EAEAEA]">
          <div className="bg-[#FAFAF8] p-10 border border-[#EAEAEA]">
            <h3 className="text-[10px] text-[#B8912F] font-bold mb-4 uppercase tracking-[0.2em]">Our Commitment</h3>
            <p className="text-[14px] leading-relaxed text-[#4A4A4A]">
              We are committed to maintaining the highest standards in our manufacturing processes. From selecting the raw yarn to the final finishing touches, every step is monitored to ensure the fabric you receive is flawless.
            </p>
          </div>
          <div className="bg-[#FAFAF8] p-10 border border-[#EAEAEA]">
            <h3 className="text-[10px] text-[#B8912F] font-bold mb-4 uppercase tracking-[0.2em]">Direct to You</h3>
            <p className="text-[14px] leading-relaxed text-[#4A4A4A]">
              By cutting out unnecessary middlemen, we offer factory-direct pricing without compromising on quality. This digital catalogue is designed to make it easy for you to view our latest collections and reach out to us directly on WhatsApp.
            </p>
          </div>
        </section>

        <div className="mt-16 text-center py-10">
          <p className="text-2xl text-brand-black font-medium tracking-tight italic">
            "Quality isn't just a promise; it's the very fabric of our business."
          </p>
        </div>
      </div>
    </div>
  );
}
