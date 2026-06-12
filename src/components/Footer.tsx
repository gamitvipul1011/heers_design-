import { useShop } from '../store/useShop';

const WHATSAPP_NUMBER = '919601544710';

export default function Footer() {
  const { setPage } = useShop();

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hi! I want to know more about Heer\'s Design.');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <footer className="relative bg-navy-dark border-t border-gold/10">
      {/* Marquee */}
      <div className="overflow-hidden py-4 border-b border-gold/5">
        <div className="animate-marquee whitespace-nowrap flex gap-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="font-heading text-6xl text-gold/[0.04] select-none">
              HEER'S DESIGN — LUXURY ATELIER — HANDCRAFTED IN INDIA —&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center">
                <span className="font-heading text-gold text-lg font-bold">H</span>
              </div>
              <div>
                <h3 className="font-heading text-lg text-cream">
                  Heer's <span className="text-gold">Design</span>
                </h3>
              </div>
            </div>
            <p className="text-sm text-cream/30 leading-relaxed mb-6">
              Where centuries-old artistry meets contemporary elegance. Each piece is a testament to India's rich textile heritage.
            </p>
            <div className="flex gap-3">
              {['Instagram', 'Pinterest', 'Facebook'].map((s) => (
                <a
                  key={s}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-9 h-9 rounded-lg border border-gold/10 flex items-center justify-center text-cream/30 hover:text-gold hover:border-gold/30 transition-colors text-xs"
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-heading text-cream mb-4 text-sm tracking-wider">Shop</h4>
            <ul className="space-y-2.5">
              {['Sarees', 'Lehengas', 'Evening Wear', 'Bridal Collection'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => setPage('shop')}
                    className="text-sm text-cream/30 hover:text-gold transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading text-cream mb-4 text-sm tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {['About Us', 'Artisan Stories', 'Sustainability', 'Careers'].map((item) => (
                <li key={item}>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-cream/30 hover:text-gold transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & WhatsApp */}
          <div>
            <h4 className="font-heading text-cream mb-4 text-sm tracking-wider">Contact Us</h4>
            
            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all group mb-4"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#25D366] group-hover:text-[#20BD5A]">Chat on WhatsApp</p>
                <p className="text-[10px] text-cream/40">Quick response within minutes</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto text-[#25D366]/50">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/50">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-cream/30">Phone</p>
                  <p className="text-sm text-cream/60">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/50">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-cream/30">Email</p>
                  <p className="text-sm text-cream/60">hello@heersdesign.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/50">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-cream/30">Studio</p>
                  <p className="text-sm text-cream/60 leading-relaxed">
                    123 Fashion Street, Vastrapur<br />
                    Ahmedabad, Gujarat 380015
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/50">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-cream/30">Hours</p>
                  <p className="text-sm text-cream/60">10:00 AM - 8:00 PM (Mon-Sat)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gold/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/20">
            © 2026 Heer's Design. All rights reserved. Handcrafted with ♥ in India.
          </p>
          <div className="flex gap-6 text-xs text-cream/20">
            {['Privacy', 'Terms', 'Shipping', 'Returns'].map((link) => (
              <a key={link} href="#" onClick={(e) => e.preventDefault()} className="hover:text-gold/50 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
