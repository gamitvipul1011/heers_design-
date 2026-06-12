import { motion } from 'framer-motion';
import { useAuth } from '../store/useAuth';
import { useShop } from '../store/useShop';

const STATUS_STEPS = ['placed', 'confirmed', 'in_production', 'shipped', 'delivered'];
const STATUS_LABELS: Record<string, string> = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  in_production: 'In Production',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

export default function Orders() {
  const { getUserOrders, isLoggedIn, setShowLoginModal } = useAuth();
  const { setPage } = useShop();
  const orders = getUserOrders();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-navy pt-28 pb-20">
        <div className="max-w-xl mx-auto px-4 text-center py-24">
          <div className="w-20 h-20 mx-auto rounded-full bg-gold/5 flex items-center justify-center mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/30">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 className="font-heading text-2xl text-cream mb-2">Please Login</h2>
          <p className="text-sm text-cream/40 mb-6">Login to view your orders</p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-8 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xs text-gold tracking-[0.3em] uppercase mb-3">Your Orders</p>
          <h1 className="font-heading text-4xl text-cream mb-4">Order History</h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-rose mx-auto" />
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gold/5 flex items-center justify-center mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/30">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <h3 className="font-heading text-xl text-cream mb-2">No orders yet</h3>
            <p className="text-sm text-cream/40 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => setPage('shop')}
              className="px-8 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all"
            >
              Explore Collection
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => {
              const statusIndex = STATUS_STEPS.indexOf(order.status);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass rounded-2xl overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-gold/10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-cream/40 mb-1">Order ID</p>
                      <p className="font-mono text-gold font-medium">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-cream/40 mb-1">Date</p>
                      <p className="text-sm text-cream/70">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-cream/40 mb-1">Total</p>
                      <p className="font-heading text-lg text-gold">₹{order.total.toLocaleString('en-IN')}</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                      order.status === 'delivered'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : order.status === 'shipped'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-gold/10 text-gold border border-gold/20'
                    }`}>
                      {STATUS_LABELS[order.status]}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="p-6 border-b border-gold/10">
                    <div className="flex items-center justify-between">
                      {STATUS_STEPS.map((step, i) => (
                        <div key={step} className="flex items-center">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              i <= statusIndex
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-white/5 text-cream/20 border border-gold/10'
                            }`}>
                              {i <= statusIndex ? '✓' : i + 1}
                            </div>
                            <span className={`text-[10px] mt-1.5 ${
                              i <= statusIndex ? 'text-emerald-400' : 'text-cream/20'
                            }`}>
                              {STATUS_LABELS[step]}
                            </span>
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 ${
                              i < statusIndex ? 'bg-emerald-500/30' : 'bg-gold/10'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-6">
                    <p className="text-xs text-cream/40 mb-3">{order.items.length} item(s)</p>
                    <div className="space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-4 p-3 rounded-xl bg-white/[0.02]">
                          <div className="w-14 h-18 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.colorImage || item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-cream font-medium">{item.name}</p>
                            <p className="text-xs text-cream/30 mt-0.5">
                              {item.color} · {item.size} · Qty: {item.quantity}
                            </p>
                            {item.isCustom && item.customDetails && (
                              <div className="mt-2 p-2 rounded-lg bg-gold/5 border border-gold/10">
                                <p className="text-[10px] text-gold/60 uppercase tracking-wider mb-1">Custom Design</p>
                                <p className="text-xs text-cream/50">
                                  {item.customDetails.garment} · {item.customDetails.fabric}
                                </p>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
