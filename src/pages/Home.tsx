import { motion } from 'framer-motion';
import { useShop } from '../store/useShop';
import { collections, testimonials } from '../data/products';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useState } from 'react';

const SAREE_COLORS = [
  { name: 'Royal Rose', hex: '#C8577A' },
  { name: 'Navy Night', hex: '#0a1128' },
  { name: 'Temple Gold', hex: '#D4AF37' },
  { name: 'Peacock', hex: '#005f73' },
  { name: 'Sangria', hex: '#722f37' },
];

export default function Home() {
  const { setPage, products } = useShop();
  const featured = products.filter((p) => p.featured);
  const [sareeColor, setSareeColor] = useState(SAREE_COLORS[0]);

  return (
    <div>
      <Hero />

      {/* Featured Products */}
      <section className="py-24 bg-navy relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs text-gold tracking-[0.3em] uppercase mb-3">Curated for You</p>
            <h2 className="font-heading text-4xl md:text-5xl text-cream mb-4">Featured Edit</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-rose mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setPage('shop')}
              className="px-8 py-3.5 border border-gold/30 text-gold rounded-xl hover:bg-gold/5 transition-all text-sm font-medium"
            >
              View All Collection →
            </button>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-24 bg-navy-dark relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs text-rose tracking-[0.3em] uppercase mb-3">Discover</p>
            <h2 className="font-heading text-4xl md:text-5xl text-cream mb-4">Collections</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-rose to-gold mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((col, i) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                onClick={() => setPage('shop')}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
              >
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-xs text-gold tracking-widest uppercase mb-2">Collection</p>
                  <h3 className="font-heading text-2xl text-cream mb-2">{col.name}</h3>
                  <p className="text-sm text-cream/50 mb-4">{col.description}</p>
                  <span className="text-gold text-sm font-medium group-hover:underline">
                    Explore →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Saree Customizer Preview */}
      <section className="py-24 bg-navy relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs text-gold tracking-[0.3em] uppercase mb-3">Design Studio</p>
              <h2 className="font-heading text-4xl md:text-5xl text-cream mb-6 leading-tight">
                Create Your <br /><span className="gold-shimmer">Dream Garment</span>
              </h2>
              <p className="text-cream/40 leading-relaxed mb-8">
                Choose your fabric, color, and embroidery. Upload your vision and our master artisans will bring it to life. Every piece is uniquely yours.
              </p>

              {/* Color picker */}
              <div className="mb-8">
                <p className="text-sm text-cream/50 mb-3">Choose a color:</p>
                <div className="flex gap-3">
                  {SAREE_COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSareeColor(c)}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                        sareeColor.name === c.name
                          ? 'border-gold scale-110 shadow-lg'
                          : 'border-transparent hover:border-gold/30'
                      }`}
                      style={{ backgroundColor: c.hex, boxShadow: sareeColor.name === c.name ? `0 0 20px ${c.hex}40` : undefined }}
                      title={c.name}
                    />
                  ))}
                </div>
                <p className="text-xs text-gold/60 mt-2">{sareeColor.name}</p>
              </div>

              <button
                onClick={() => setPage('customizer')}
                className="px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold rounded-xl hover:shadow-lg hover:shadow-gold/25 transition-all"
              >
                Open Design Studio →
              </button>
            </motion.div>

            {/* CSS Saree Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div
                className="saree-drape w-72 h-96 rounded-2xl transition-all duration-700 relative"
                style={{ backgroundColor: sareeColor.hex }}
              >
                {/* Pallu */}
                <div
                  className="pallu"
                  style={{
                    background: `linear-gradient(135deg, ${sareeColor.hex}dd, ${sareeColor.hex}88)`,
                  }}
                />
                {/* Pleats */}
                <div className="pleats" />
                {/* Zari border */}
                <div className="border-zari" />
                {/* Gold motifs */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="motif"
                    style={{
                      top: `${15 + Math.random() * 65}%`,
                      left: `${10 + Math.random() * 75}%`,
                      width: `${5 + Math.random() * 6}px`,
                      height: `${5 + Math.random() * 6}px`,
                      opacity: 0.2 + Math.random() * 0.3,
                    }}
                  />
                ))}
                {/* Label */}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Preview</p>
                  <p className="font-heading text-sm text-white/70">{sareeColor.name}</p>
                </div>
                {/* Ambient glow */}
                <div
                  className="absolute inset-0 rounded-2xl transition-all duration-700"
                  style={{ boxShadow: `0 0 60px ${sareeColor.hex}30, 0 0 120px ${sareeColor.hex}10` }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-navy-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs text-gold tracking-[0.3em] uppercase mb-3">Testimonials</p>
            <h2 className="font-heading text-4xl text-cream mb-4">Words of Love</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-rose mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-8 rounded-2xl glass relative"
              >
                <div className="absolute top-6 right-6 font-heading text-6xl text-gold/[0.08]">"</div>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }, (_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#D4AF37" stroke="#D4AF37" strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-cream/50 leading-relaxed mb-6 italic">
                  "{t.text}"
                </p>
                <div>
                  <p className="text-sm font-semibold text-cream">{t.name}</p>
                  <p className="text-xs text-gold/40">{t.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose rounded-full blur-[100px]" />
        </div>
        <div className="max-w-xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-heading text-3xl text-cream mb-4">Join the Heer's World</h2>
          <p className="text-sm text-cream/40 mb-8">
            Be the first to discover new collections, exclusive previews, and artisan stories.
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm placeholder:text-cream/20 focus:outline-none focus:border-gold/30"
            />
            <button className="px-6 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
