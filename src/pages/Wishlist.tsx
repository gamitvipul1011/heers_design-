import { motion } from 'framer-motion';
import { useShop } from '../store/useShop';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlist, setPage, products } = useShop();
  const wishedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xs text-rose tracking-[0.3em] uppercase mb-3">Your Favourites</p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream mb-4">Wishlist</h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-rose to-gold mx-auto mb-4" />
          <p className="text-sm text-cream/30">
            {wishedProducts.length} piece{wishedProducts.length !== 1 ? 's' : ''} saved
          </p>
        </motion.div>

        {wishedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishedProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-rose/5 flex items-center justify-center mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose/30">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3 className="font-heading text-xl text-cream mb-2">Your wishlist is empty</h3>
            <p className="text-sm text-cream/30 mb-6">Start adding pieces you love!</p>
            <button
              onClick={() => setPage('shop')}
              className="px-8 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold rounded-xl text-sm hover:shadow-lg hover:shadow-gold/20 transition-all"
            >
              Explore Collection
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
