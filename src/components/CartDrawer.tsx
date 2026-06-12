import { useShop } from '../store/useShop';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { cart, cartOpen, toggleCart, removeFromCart, updateQuantity, setPage } = useShop();

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={toggleCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-[61] w-full max-w-md bg-navy-dark border-l border-gold/10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gold/10">
              <div>
                <h2 className="font-heading text-xl text-cream">Shopping Bag</h2>
                <p className="text-xs text-gold/60 mt-0.5">
                  {cart.reduce((s, c) => s + c.quantity, 0)} items
                </p>
              </div>
              <button
                onClick={toggleCart}
                className="p-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-cream/60">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-full bg-gold/5 flex items-center justify-center mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/30">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                  </div>
                  <p className="text-cream/40 text-sm font-medium">Your bag is empty</p>
                  <button
                    onClick={() => { toggleCart(); setPage('shop'); }}
                    className="mt-4 text-gold text-sm hover:underline"
                  >
                    Continue Shopping →
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                    layout
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    className="flex gap-4 p-3 rounded-2xl bg-white/[0.03] border border-gold/5"
                  >
                    {/* Image */}
                    <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.selectedColorImage || item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-cream truncate">{item.product.name}</h3>
                      <p className="text-xs text-gold/50 mt-0.5">
                        {item.selectedColor} · {item.selectedSize}
                      </p>
                      <p className="text-sm font-heading text-gold mt-2">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>

                      {/* Quantity */}
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md border border-gold/20 flex items-center justify-center text-cream/60 hover:bg-gold/10 text-xs"
                        >
                          −
                        </button>
                        <span className="text-sm text-cream font-medium w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md border border-gold/20 flex items-center justify-center text-cream/60 hover:bg-gold/10 text-xs"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-auto text-xs text-rose/60 hover:text-rose transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gold/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cream/60">Subtotal</span>
                  <span className="font-heading text-xl text-gold">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[10px] text-cream/30">
                  Shipping & taxes calculated at checkout
                </p>
                <button
                  onClick={() => {
                    toggleCart();
                    setPage('checkout');
                  }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all active:scale-[0.98]"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => { toggleCart(); setPage('shop'); }}
                  className="w-full py-3 rounded-xl border border-gold/20 text-cream/60 text-sm hover:bg-white/5 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
