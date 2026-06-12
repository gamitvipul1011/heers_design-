import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../store/useShop';
import { useAuth } from '../store/useAuth';
import ProductCard from '../components/ProductCard';

const WHATSAPP_NUMBER = '919601544710';

export default function ProductDetail() {
  const { selectedProductId, setPage, addToCart, toggleWishlist, wishlist, toggleCart, addToast, products } = useShop();
  const { isLoggedIn, setShowLoginModal } = useAuth();
  const product = products.find((p) => p.id === selectedProductId);

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState<'story' | 'fabric' | 'care'>('story');
  const [quantity, setQuantity] = useState(1);

  // Reset selections whenever the product changes
  useEffect(() => {
    setSelectedColorIdx(0);
    setSelectedSize('');
    setQuantity(1);
    setActiveTab('story');
  }, [selectedProductId]);

  if (!product) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <p className="text-cream/40 mb-4">Product not found</p>
          <button onClick={() => setPage('shop')} className="text-gold hover:underline">Back to Shop</button>
        </div>
      </div>
    );
  }

  const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
  const safeIdx = hasColors ? Math.min(selectedColorIdx, product.colors.length - 1) : 0;
  const currentColor = hasColors ? product.colors[safeIdx] : null;

  // Main image = selected color image, else first product image
  const mainImage = currentColor?.image || product.images?.[0] || product.image;
  const selectedColorName = currentColor?.name || '';
  const selectedColorImage = mainImage;

  const requiresSize =
    Array.isArray(product.sizes) &&
    product.sizes.length > 0 &&
    !(product.sizes.length === 1 && product.sizes[0].toLowerCase() === 'free size');

  const handleAddToBag = () => {
    if (requiresSize && !selectedSize) {
      addToast('Please select a size', 'info');
      return;
    }
    addToCart({
      product,
      quantity,
      selectedColor: selectedColorName,
      selectedColorImage,
      selectedSize: selectedSize || product.sizes?.[0] || 'Free Size',
    });
    toggleCart();
  };

  const handleBuyNow = () => {
    if (requiresSize && !selectedSize) {
      addToast('Please select a size', 'info');
      return;
    }
    if (!isLoggedIn) {
      setShowLoginModal(true);
      addToast('Please login to continue', 'info');
      return;
    }
    addToCart({
      product,
      quantity,
      selectedColor: selectedColorName,
      selectedColorImage,
      selectedSize: selectedSize || product.sizes?.[0] || 'Free Size',
    });
    if (useShop.getState().cartOpen) toggleCart();
    setPage('checkout');
  };

  const handleWhatsAppInquiry = () => {
    const msg = encodeURIComponent(
      `Hi! I'm interested in:\n\n*${product.name}*\nPrice: ₹${product.price.toLocaleString('en-IN')}\n${selectedColorName ? `Color: ${selectedColorName}\n` : ''}${selectedSize ? `Size: ${selectedSize}\n` : ''}\nPlease provide more details.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  const handleWhatsAppBuy = () => {
    if (requiresSize && !selectedSize) { addToast('Please select a size first', 'info'); return; }
    const msg = encodeURIComponent(
      `Hi! I want to buy:\n\n*${product.name}*\nPrice: ₹${product.price.toLocaleString('en-IN')}\n${selectedColorName ? `Color: ${selectedColorName}\n` : ''}Size: ${selectedSize || 'Free Size'}\nQty: ${quantity}\n\nTotal: ₹${(product.price * quantity).toLocaleString('en-IN')}\n\nPlease confirm availability.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  const isWished = wishlist.includes(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const tabs = {
    story: <p className="text-cream/50 leading-relaxed text-sm">{product.description}</p>,
    fabric: (
      <div className="space-y-3 text-sm text-cream/50">
        <p><span className="text-gold/70">Material:</span> {product.fabricInfo?.material || product.fabric}</p>
        <p><span className="text-gold/70">Weight:</span> {product.fabricInfo?.weight || 'Approximately 800g'}</p>
        <p><span className="text-gold/70">Weave:</span> {product.fabricInfo?.weave || 'Handwoven with traditional techniques'}</p>
        <p><span className="text-gold/70">Origin:</span> {product.fabricInfo?.origin || 'Crafted by master artisans in India'}</p>
      </div>
    ),
    care: (
      <ul className="space-y-2 text-sm text-cream/50">
        {(product.careInstructions
          ? product.careInstructions.split('\n').filter(Boolean)
          : ['Dry clean only for best results', 'Store in a cool, dry place away from direct sunlight', 'Wrap in muslin cloth for long-term storage', 'Iron on low heat with a pressing cloth']
        ).map((line, i) => (
          <li key={i} className="flex items-start gap-2"><span className="text-gold">•</span>{line}</li>
        ))}
      </ul>
    ),
  };

  return (
    <div className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-cream/30 mb-8">
          <button onClick={() => setPage('home')} className="hover:text-gold transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => setPage('shop')} className="hover:text-gold transition-colors">Shop</button>
          <span>/</span>
          <span className="text-cream/50">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* ── Gallery ── */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            {/* Main image — switches when color selected */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 group">
              <img
                key={mainImage}
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {product.badge && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-rose to-rose-dark text-white text-xs font-bold px-4 py-1.5 rounded-full">
                  {product.badge}
                </div>
              )}
              {selectedColorName && (
                <div className="absolute bottom-4 left-4 bg-navy/70 backdrop-blur-sm text-cream/80 text-xs px-3 py-1.5 rounded-full border border-gold/20">
                  {selectedColorName}
                </div>
              )}
            </div>

            {/* Color image thumbnails */}
            {hasColors && (
              <div className="flex gap-3">
                {product.colors.map((c, i) => (
                  <button
                    key={`${c.name}-${i}`}
                    onClick={() => setSelectedColorIdx(i)}
                    title={c.name}
                    className={`flex-1 aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                      i === safeIdx
                        ? 'ring-2 ring-gold ring-offset-2 ring-offset-navy scale-105'
                        : 'opacity-50 hover:opacity-80 hover:scale-[1.02]'
                    }`}
                  >
                    <img
                      src={c.image || product.image}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Details ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div>
              <p className="text-xs text-gold tracking-[0.3em] uppercase mb-2">{product.fabric}</p>
              <h1 className="font-heading text-3xl md:text-4xl text-cream mb-3">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? '#D4AF37' : 'none'} stroke="#D4AF37" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gold">{product.rating}</span>
                <span className="text-xs text-cream/30">({product.reviews} reviews)</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-3xl text-gold">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice && (
                  <span className="text-lg text-cream/30 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                )}
                {product.originalPrice && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>

            <div className="h-px bg-gold/10" />

            {/* Color Selector */}
            {hasColors && (
              <div>
                <p className="text-sm text-cream/60 mb-3">
                  Color: <span className="text-gold font-medium">{selectedColorName}</span>
                </p>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((c, i) => (
                    <button
                      key={`swatch-${i}`}
                      onClick={() => setSelectedColorIdx(i)}
                      title={c.name}
                      className={`w-11 h-11 rounded-full border-2 transition-all duration-300 ${
                        i === safeIdx ? 'border-gold scale-110' : 'border-transparent hover:border-gold/30'
                      }`}
                      style={{
                        backgroundColor: c.hex || '#D4AF37',
                        boxShadow: i === safeIdx ? `0 0 20px ${c.hex || '#D4AF37'}60` : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <div>
                <p className="text-sm text-cream/60 mb-3">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                        s === selectedSize
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-gold/10 text-cream/40 hover:border-gold/30 hover:text-cream/60'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="h-px bg-gold/10" />

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-cream/60">Quantity:</span>
              <div className="flex items-center border border-gold/10 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2.5 text-cream/50 hover:bg-white/5 transition-colors">−</button>
                <span className="w-12 text-center text-cream font-medium text-sm">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="px-4 py-2.5 text-cream/50 hover:bg-white/5 transition-colors">+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToBag}
                  className="flex-1 py-4 rounded-xl border-2 border-gold text-gold font-semibold hover:bg-gold/5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  Add to Bag
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-navy font-bold hover:shadow-lg hover:shadow-gold/25 transition-all duration-300 active:scale-[0.98]"
                >
                  Buy Now
                </button>
              </div>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-full py-3 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 ${
                  isWished ? 'border-rose/30 bg-rose/10 text-rose' : 'border-gold/10 text-cream/40 hover:border-gold/20 hover:text-cream/60'
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isWished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {isWished ? 'Added to Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* WhatsApp Section */}
            <div className="glass rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-cream">Need Help?</p>
                  <p className="text-xs text-cream/40">Chat with us on WhatsApp</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleWhatsAppInquiry} className="py-3 px-4 rounded-xl border border-[#25D366]/30 text-[#25D366] text-sm font-medium hover:bg-[#25D366]/5 transition-all flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  Ask Question
                </button>
                <button onClick={handleWhatsAppBuy} className="py-3 px-4 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20BD5A] transition-all flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Buy via WhatsApp
                </button>
              </div>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '🚚', label: 'Free Shipping', sub: 'Over ₹10,000' },
                { icon: '🔄', label: '15-Day Returns', sub: 'Easy exchange' },
                { icon: '✨', label: 'Handcrafted', sub: 'Artisan made' },
              ].map((perk) => (
                <div key={perk.label} className="text-center p-3 rounded-xl bg-white/[0.02] border border-gold/5">
                  <span className="text-lg">{perk.icon}</span>
                  <p className="text-[10px] font-medium text-cream/50 mt-1">{perk.label}</p>
                  <p className="text-[9px] text-cream/25">{perk.sub}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div>
              <div className="flex border-b border-gold/10 gap-6">
                {(['story', 'fabric', 'care'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium capitalize transition-colors relative ${activeTab === tab ? 'text-gold' : 'text-cream/30 hover:text-cream/50'}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="product-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                    )}
                  </button>
                ))}
              </div>
              <div className="pt-4">{tabs[activeTab]}</div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="font-heading text-2xl text-cream mb-8">You May Also Love</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
