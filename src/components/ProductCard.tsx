import { useShop } from '../store/useShop';
import { motion } from 'framer-motion';
import type { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { setPage, toggleWishlist, wishlist } = useShop();
  const isWished = wishlist.includes(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={() => setPage('product', product.id)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-rose to-rose-dark text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
            {product.badge}
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-navy/40 backdrop-blur-md flex items-center justify-center hover:bg-navy/60 transition-all group/heart"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isWished ? '#C8577A' : 'none'}
            stroke={isWished ? '#C8577A' : 'white'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Quick View */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <button className="w-full py-3 rounded-xl glass text-cream text-sm font-medium hover:bg-gold/20 transition-colors">
            Quick View →
          </button>
        </div>

        {/* Color dots */}
        <div className="absolute bottom-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {product.colors.slice(0, 3).map((c) => (
            <div
              key={c.name}
              className="w-3.5 h-3.5 rounded-full border-2 border-white/50 shadow-md"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1.5 px-1">
        <p className="text-[10px] font-bold text-gold/60 uppercase tracking-widest">
          {product.fabric}
        </p>
        <h3 className="font-heading text-lg text-cream group-hover:text-gold transition-colors duration-300">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? '#D4AF37' : 'none'} stroke="#D4AF37" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
          <span className="text-[10px] text-cream/30">({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-lg text-gold">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-cream/30 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          {discount > 0 && (
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
