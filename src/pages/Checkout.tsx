import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../store/useShop';
import { useAuth } from '../store/useAuth';

type Step = 'shipping' | 'payment' | 'review' | 'done';

export default function Checkout() {
  const { cart, clearCart, setPage, addToast } = useShop();
  const { isLoggedIn, user, addOrder, setShowLoginModal } = useAuth();

  const [step, setStep] = useState<Step>('shipping');
  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('cod');
  const [orderId, setOrderId] = useState('');

  // Pre-fill when user is available
  useEffect(() => {
    if (user) {
      setShipping((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCost = total >= 10000 ? 0 : 500;
  const grand = total + shippingCost;

  const steps: { key: Step; label: string; num: number }[] = [
    { key: 'shipping', label: 'Shipping', num: 1 },
    { key: 'payment', label: 'Payment', num: 2 },
    { key: 'review', label: 'Review', num: 3 },
  ];

  // Not logged in → show login prompt (no useEffect loop)
  if (!isLoggedIn && step !== 'done') {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gold/5 flex items-center justify-center mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/40">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 className="font-heading text-2xl text-cream mb-2">Login Required</h2>
          <p className="text-sm text-cream/40 mb-6">Please login to continue checkout</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setPage('shop')}
              className="px-6 py-3 rounded-xl border border-gold/20 text-cream/60 text-sm hover:bg-white/5 transition-colors"
            >
              ← Back to Shop
            </button>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all"
            >
              Login / Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cart.length === 0 && step !== 'done') {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold/5 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/30">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <p className="text-cream/40 mb-4">Your bag is empty</p>
          <button onClick={() => setPage('shop')} className="text-gold hover:underline text-sm">Browse Collection</button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    if (!user) return;
    try {
      const id = addOrder({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        items: cart.map((item) => ({
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          color: item.selectedColor,
          size: item.selectedSize,
          image: item.selectedColorImage || item.product.image,
          colorImage: item.selectedColorImage,
        })),
        shipping,
        paymentMethod,
        total: grand,
      });
      setOrderId(id);
      clearCart();
      setStep('done');
      addToast('Order placed successfully! 🎉', 'success');
    } catch (err) {
      console.error('Failed to place order:', err);
      addToast('Something went wrong placing your order. Please try again.', 'error');
    }
  };

  const handleContinueToPayment = () => {
    if (!shipping.name.trim()) { addToast('Please enter your full name', 'error'); return; }
    if (!shipping.email.trim() || !/\S+@\S+\.\S+/.test(shipping.email)) { addToast('Please enter a valid email', 'error'); return; }
    if (!/^\d{10}$/.test(shipping.phone)) { addToast('Please enter a valid 10-digit phone number', 'error'); return; }
    if (!shipping.address.trim()) { addToast('Please enter your address', 'error'); return; }
    if (!shipping.city.trim()) { addToast('Please enter your city', 'error'); return; }
    if (!shipping.state.trim()) { addToast('Please enter your state', 'error'); return; }
    if (!/^\d{6}$/.test(shipping.pincode)) { addToast('Please enter a valid 6-digit pincode', 'error'); return; }
    setStep('payment');
  };

  return (
    <div className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Step indicator */}
        {step !== 'done' && (
          <div className="flex items-center justify-center gap-4 mb-12">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s.key
                      ? 'bg-gold text-navy'
                      : steps.findIndex((st) => st.key === step) > i
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/5 text-cream/30 border border-gold/10'
                  }`}>
                    {steps.findIndex((st) => st.key === step) > i ? '✓' : s.num}
                  </div>
                  <span className={`text-sm font-medium hidden sm:inline ${step === s.key ? 'text-gold' : 'text-cream/30'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-12 h-px ${steps.findIndex((st) => st.key === step) > i ? 'bg-emerald-500/30' : 'bg-gold/10'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* Shipping */}
          {step === 'shipping' && (
            <motion.div key="shipping" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="glass rounded-3xl p-8">
              <h2 className="font-heading text-2xl text-cream mb-6">Shipping Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Full Name', type: 'text', full: true },
                  { key: 'email', label: 'Email', type: 'email', full: false },
                  { key: 'phone', label: 'Phone', type: 'tel', full: false },
                  { key: 'address', label: 'Address', type: 'text', full: true },
                  { key: 'city', label: 'City', type: 'text', full: false },
                  { key: 'state', label: 'State', type: 'text', full: false },
                  { key: 'pincode', label: 'Pincode', type: 'text', full: false },
                ].map((field) => (
                  <div key={field.key} className={field.full ? 'sm:col-span-2' : ''}>
                    <label className="text-xs text-cream/40 mb-1.5 block">{field.label}</label>
                    <input
                      type={field.type}
                      value={shipping[field.key as keyof typeof shipping]}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (field.key === 'phone') val = val.replace(/\D/g, '').slice(0, 10);
                        else if (field.key === 'pincode') val = val.replace(/\D/g, '').slice(0, 6);
                        setShipping({ ...shipping, [field.key]: val });
                      }}
                      inputMode={field.key === 'phone' || field.key === 'pincode' ? 'numeric' : undefined}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30 placeholder:text-cream/15"
                      placeholder={field.key === 'phone' ? '10-digit mobile number' : field.key === 'pincode' ? '6-digit pincode' : field.label}
                    />
                  </div>
                ))}
              </div>
              <button onClick={handleContinueToPayment} className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold hover:shadow-lg hover:shadow-gold/20 transition-all">
                Continue to Payment →
              </button>
            </motion.div>
          )}

          {/* Payment */}
          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="glass rounded-3xl p-8">
              <h2 className="font-heading text-2xl text-cream mb-6">Payment Method</h2>
              <div className="space-y-3 mb-8">
                {[
                  { value: 'cod' as const, label: 'Cash on Delivery', icon: '💵' },
                  { value: 'upi' as const, label: 'UPI Payment', icon: '📱' },
                  { value: 'card' as const, label: 'Credit / Debit Card', icon: '💳' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPaymentMethod(opt.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                      paymentMethod === opt.value ? 'border-gold bg-gold/5 text-gold' : 'border-gold/10 text-cream/40 hover:border-gold/20'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span className="text-sm font-medium">{opt.label}</span>
                    <span className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === opt.value ? 'border-gold bg-gold' : 'border-gold/20'}`}>
                      {paymentMethod === opt.value && <span className="text-navy text-[10px] font-bold">✓</span>}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('shipping')} className="px-6 py-3.5 rounded-xl border border-gold/20 text-cream/60 text-sm hover:bg-white/5 transition-colors">← Back</button>
                <button onClick={() => setStep('review')} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold hover:shadow-lg hover:shadow-gold/20 transition-all">
                  Review Order →
                </button>
              </div>
            </motion.div>
          )}

          {/* Review */}
          {step === 'review' && (
            <motion.div key="review" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="glass rounded-3xl p-8">
              <h2 className="font-heading text-2xl text-cream mb-6">Order Review</h2>

              <div className="space-y-3 mb-6">
                {cart.map((item, idx) => (
                  <div key={`${item.product.id}-${item.selectedColor}-${idx}`} className="flex gap-4 p-3 rounded-xl bg-white/[0.02]">
                    <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gold/10">
                      <img
                        src={item.selectedColorImage || item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-cream font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-cream/30 mt-0.5">
                        {[item.selectedColor, item.selectedSize, `Qty: ${item.quantity}`].filter(Boolean).join(' · ')}
                      </p>
                      <p className="text-sm text-gold mt-1">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 py-4 border-t border-gold/10">
                <div className="flex justify-between text-sm">
                  <span className="text-cream/40">Subtotal</span>
                  <span className="text-cream/60">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cream/40">Shipping</span>
                  <span className="text-cream/60">{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                </div>
                <div className="h-px bg-gold/10 my-2" />
                <div className="flex justify-between">
                  <span className="text-cream/60 font-medium">Total</span>
                  <span className="font-heading text-2xl text-gold">₹{grand.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] mt-4 mb-6 border border-gold/5">
                <p className="text-xs text-gold/60 mb-1">Delivering to</p>
                <p className="text-sm text-cream/70">
                  {[shipping.name, shipping.address, shipping.city, shipping.pincode].filter(Boolean).join(', ')}
                </p>
                <p className="text-xs text-cream/30 mt-1">
                  Payment: {paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('payment')} className="px-6 py-3.5 rounded-xl border border-gold/20 text-cream/60 text-sm hover:bg-white/5 transition-colors">← Back</button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-navy font-bold hover:shadow-lg hover:shadow-gold/25 transition-all active:scale-[0.98]"
                >
                  Place Order — ₹{grand.toLocaleString('en-IN')}
                </button>
              </div>
            </motion.div>
          )}

          {/* Done */}
          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl p-12 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </motion.div>
              <h2 className="font-heading text-3xl text-cream mb-2">Order Confirmed!</h2>
              <p className="text-sm text-cream/40 mb-4">
                Your order <span className="text-gold font-mono">{orderId}</span> has been placed.
              </p>
              <div className="flex justify-center gap-6 my-8">
                {['Placed', 'Confirmed', 'Shipped', 'Delivered'].map((s, i) => (
                  <div key={s} className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${i === 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-cream/20 border border-gold/10'}`}>
                      {i === 0 ? '✓' : i + 1}
                    </div>
                    <span className={`text-[10px] ${i === 0 ? 'text-emerald-400' : 'text-cream/20'}`}>{s}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-cream/25 mb-8">Estimated delivery in 5–7 business days.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setPage('orders')} className="px-6 py-3 rounded-xl border border-gold/20 text-gold text-sm hover:bg-gold/5 transition-colors">
                  View My Orders
                </button>
                <button onClick={() => setPage('shop')} className="px-8 py-3 bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all">
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
