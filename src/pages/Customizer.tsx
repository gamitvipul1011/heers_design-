import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../store/useShop';
import { useAuth } from '../store/useAuth';

const GARMENT_TYPES = ['Saree', 'Lehenga', 'Kurti', 'Gown', 'Sharara', 'Dress'];
const FABRICS = [
  { name: 'Pure Silk', price: 15000 },
  { name: 'Chanderi', price: 12000 },
  { name: 'Organza', price: 10000 },
  { name: 'Georgette', price: 8000 },
  { name: 'Velvet', price: 18000 },
  { name: 'Cotton', price: 5000 },
];
const COLORS = [
  { name: 'Rose', hex: '#C8577A' },
  { name: 'Navy', hex: '#0a1128' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Peacock', hex: '#005f73' },
  { name: 'Maroon', hex: '#722f37' },
  { name: 'Ivory', hex: '#f5efe6' },
  { name: 'Emerald', hex: '#046307' },
  { name: 'Sapphire', hex: '#0f52ba' },
];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function Customizer() {
  const { addToast, setPage } = useShop();
  const { isLoggedIn, setShowLoginModal, user, addOrder } = useAuth();
  
  const [garment, setGarment] = useState('Saree');
  const [fabric, setFabric] = useState(FABRICS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState('M');
  const [description, setDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Checkout state
  const [step, setStep] = useState<'design' | 'shipping' | 'payment' | 'done'>('design');
  const [shipping, setShipping] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [orderId, setOrderId] = useState('');

  const basePrice = fabric.price;
  const embroideryExtra = 5000;
  const totalPrice = basePrice + embroideryExtra;

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]);
  };

  const handleProceedToCheckout = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      addToast('Please login to place your order', 'info');
      return;
    }
    setStep('shipping');
    // Pre-fill if logged in
    if (user) {
      setShipping((s) => ({ ...s, name: user.name, email: user.email }));
    }
  };

  const handlePlaceOrder = () => {
    if (!user) return;

    const id = addOrder({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      items: [{
        name: `Custom ${garment}`,
        price: totalPrice,
        quantity: 1,
        color: color.name,
        size: size,
        image: uploadedImage || 'https://images.pexels.com/photos/4048041/pexels-photo-4048041.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=300',
        isCustom: true,
        customDetails: {
          garment,
          fabric: fabric.name,
          color: color.name,
          size,
          description,
          referenceImage: uploadedImage || undefined,
        },
      }],
      shipping,
      paymentMethod,
      total: totalPrice,
    });

    setOrderId(id);
    setStep('done');
    addToast('Custom order placed successfully! 🎉', 'success');
  };

  // Design step
  if (step === 'design') {
    return (
      <div className="min-h-screen bg-navy pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="text-xs text-gold tracking-[0.3em] uppercase mb-3">Bespoke</p>
            <h1 className="font-heading text-4xl md:text-5xl text-cream mb-4">
              Design <span className="gold-shimmer">Studio</span>
            </h1>
            <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-rose mx-auto mb-4" />
            <p className="text-cream/40 max-w-lg mx-auto text-sm">
              Create your dream garment. Choose every detail, upload your vision, and our master artisans will bring it to life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left — Options */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Step 1: Garment Type */}
              <div>
                <h3 className="font-heading text-lg text-cream mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-gold/10 text-gold text-xs font-bold flex items-center justify-center">1</span>
                  Garment Type
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {GARMENT_TYPES.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGarment(g)}
                      className={`py-3 rounded-xl text-sm font-medium transition-all ${
                        garment === g
                          ? 'bg-gold/10 border border-gold text-gold'
                          : 'border border-gold/10 text-cream/40 hover:border-gold/20'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Fabric */}
              <div>
                <h3 className="font-heading text-lg text-cream mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-gold/10 text-gold text-xs font-bold flex items-center justify-center">2</span>
                  Fabric
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {FABRICS.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => setFabric(f)}
                      className={`py-3 px-4 rounded-xl text-sm transition-all text-left ${
                        fabric.name === f.name
                          ? 'bg-gold/10 border border-gold text-gold'
                          : 'border border-gold/10 text-cream/40 hover:border-gold/20'
                      }`}
                    >
                      <span className="font-medium">{f.name}</span>
                      <span className="block text-xs mt-0.5 opacity-60">
                        from ₹{f.price.toLocaleString('en-IN')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Color */}
              <div>
                <h3 className="font-heading text-lg text-cream mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-gold/10 text-gold text-xs font-bold flex items-center justify-center">3</span>
                  Color: <span className="text-gold/70 text-sm">{color.name}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c)}
                      className={`w-11 h-11 rounded-full border-2 transition-all ${
                        color.name === c.name
                          ? 'border-gold scale-110'
                          : 'border-transparent hover:border-gold/30'
                      }`}
                      style={{
                        backgroundColor: c.hex,
                        boxShadow: color.name === c.name ? `0 0 25px ${c.hex}40` : undefined,
                      }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Step 4: Size */}
              <div>
                <h3 className="font-heading text-lg text-cream mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-gold/10 text-gold text-xs font-bold flex items-center justify-center">4</span>
                  Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        size === s
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-gold/10 text-cream/40 hover:border-gold/20'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 5: Reference / Description */}
              <div>
                <h3 className="font-heading text-lg text-cream mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-gold/10 text-gold text-xs font-bold flex items-center justify-center">5</span>
                  Your Vision
                </h3>

                {/* Upload */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-4 ${
                    isDragOver
                      ? 'border-gold bg-gold/5'
                      : 'border-gold/10 hover:border-gold/20'
                  }`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  />
                  {uploadedImage ? (
                    <div className="relative">
                      <img src={uploadedImage} alt="Reference" className="w-32 h-32 mx-auto rounded-xl object-cover" />
                      <button
                        onClick={(e) => { e.stopPropagation(); setUploadedImage(null); }}
                        className="absolute top-0 right-[calc(50%-70px)] w-6 h-6 rounded-full bg-rose text-white text-xs flex items-center justify-center"
                      >
                        ✕
                      </button>
                      <p className="text-xs text-gold/40 mt-2">Reference uploaded</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 mx-auto rounded-full bg-gold/5 flex items-center justify-center mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/40">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                      <p className="text-sm text-cream/40">Drop your reference image here</p>
                      <p className="text-xs text-cream/20 mt-1">or click to browse</p>
                    </>
                  )}
                </div>

                {/* Description */}
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your vision... e.g., 'A deep maroon saree with gold paisley embroidery along the pallu, and a contrasting forest green blouse with mirror work.'"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm placeholder:text-cream/20 focus:outline-none focus:border-gold/30 resize-none"
                />
              </div>
            </motion.div>

            {/* Right — Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:sticky lg:top-32 lg:self-start"
            >
              <div className="glass rounded-3xl p-8 space-y-6">
                <h3 className="font-heading text-xl text-cream">Live Preview</h3>

                {/* 3D Preview */}
                <div className="relative perspective-[800px]">
                  <div
                    className="w-full aspect-[3/4] rounded-2xl transition-all duration-700 relative overflow-hidden"
                    style={{
                      backgroundColor: color.hex,
                      transform: 'rotateY(-5deg) rotateX(3deg)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Fabric texture overlay */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.05) 5px, rgba(255,255,255,0.05) 6px)`,
                    }} />

                    {/* Zari border */}
                    <div className="absolute bottom-0 left-0 right-0 h-[12%] bg-gradient-to-r from-[#D4AF37] via-[#f0d78c] to-[#D4AF37] opacity-40" />
                    <div className="absolute top-0 left-0 bottom-0 w-[3%] bg-gradient-to-b from-[#D4AF37] via-[#f0d78c] to-[#D4AF37] opacity-20" />

                    {/* Motif dots */}
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-[#D4AF37]"
                        style={{
                          width: `${3 + Math.random() * 5}px`,
                          height: `${3 + Math.random() * 5}px`,
                          top: `${10 + Math.random() * 70}%`,
                          left: `${10 + Math.random() * 75}%`,
                          opacity: 0.15 + Math.random() * 0.2,
                        }}
                      />
                    ))}

                    {/* Uploaded image overlay */}
                    {uploadedImage && (
                      <div className="absolute inset-4 rounded-xl overflow-hidden opacity-30">
                        <img src={uploadedImage} alt="Reference overlay" className="w-full h-full object-cover mix-blend-overlay" />
                      </div>
                    )}

                    {/* Labels */}
                    <div className="absolute bottom-6 left-0 right-0 text-center z-10">
                      <p className="text-white/60 text-xs uppercase tracking-widest">{garment}</p>
                      <p className="font-heading text-white/80 text-sm">{fabric.name} · {color.name}</p>
                    </div>

                    {/* Ambient glow */}
                    <div
                      className="absolute -inset-4 rounded-3xl transition-all duration-700 -z-10"
                      style={{ boxShadow: `0 0 80px ${color.hex}20, 0 0 160px ${color.hex}10` }}
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-3 pt-4 border-t border-gold/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-cream/40">{garment} — {fabric.name}</span>
                    <span className="text-cream/60">₹{basePrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cream/40">Embroidery & Finishing</span>
                    <span className="text-cream/60">₹{embroideryExtra.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-px bg-gold/10" />
                  <div className="flex justify-between">
                    <span className="text-sm text-cream/60">Estimated Total</span>
                    <span className="font-heading text-xl text-gold">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[10px] text-cream/25">
                    Final price may vary based on complexity. Our team will confirm before production.
                  </p>
                </div>

                {/* Submit */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold hover:shadow-lg hover:shadow-gold/25 transition-all active:scale-[0.98]"
                >
                  Proceed to Checkout →
                </button>

                {!isLoggedIn && (
                  <p className="text-center text-[10px] text-cream/30">
                    You'll need to login to place your order
                  </p>
                )}

                <p className="text-center text-[10px] text-cream/20">
                  Estimated delivery: 4-6 weeks · Free shipping included
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Shipping step
  if (step === 'shipping') {
    return (
      <div className="min-h-screen bg-navy pt-28 pb-20">
        <div className="max-w-xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8"
          >
            <h2 className="font-heading text-2xl text-cream mb-6">Shipping Details</h2>
            <div className="space-y-4">
              {[
                { key: 'name', label: 'Full Name', type: 'text' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'phone', label: 'Phone', type: 'tel' },
                { key: 'address', label: 'Address', type: 'text' },
                { key: 'city', label: 'City', type: 'text' },
                { key: 'state', label: 'State', type: 'text' },
                { key: 'pincode', label: 'Pincode', type: 'text' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs text-cream/40 mb-1.5 block">{field.label}</label>
                  <input
                    type={field.type}
                    value={shipping[field.key as keyof typeof shipping]}
                    onChange={(e) => setShipping({ ...shipping, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep('design')}
                className="px-6 py-3 rounded-xl border border-gold/20 text-cream/60 text-sm"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep('payment')}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold"
              >
                Continue to Payment →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Payment step
  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-navy pt-28 pb-20">
        <div className="max-w-xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8"
          >
            <h2 className="font-heading text-2xl text-cream mb-6">Payment Method</h2>

            <div className="space-y-3 mb-6">
              {[
                { value: 'card' as const, label: 'Credit / Debit Card', icon: '💳' },
                { value: 'upi' as const, label: 'UPI Payment', icon: '📱' },
                { value: 'cod' as const, label: 'Cash on Delivery', icon: '💵' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPaymentMethod(opt.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    paymentMethod === opt.value
                      ? 'border-gold bg-gold/5 text-gold'
                      : 'border-gold/10 text-cream/40 hover:border-gold/20'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl bg-white/[0.02] mb-6">
              <p className="text-xs text-cream/40 mb-2">Order Summary</p>
              <div className="flex justify-between text-sm">
                <span className="text-cream/60">Custom {garment} ({fabric.name})</span>
                <span className="text-gold">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('shipping')}
                className="px-6 py-3 rounded-xl border border-gold/20 text-cream/60 text-sm"
              >
                ← Back
              </button>
              <button
                onClick={handlePlaceOrder}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-navy font-bold"
              >
                Place Order — ₹{totalPrice.toLocaleString('en-IN')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Done step
  return (
    <div className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-6"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-400">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </motion.div>
          <h2 className="font-heading text-3xl text-cream mb-2">Custom Order Placed!</h2>
          <p className="text-sm text-cream/40 mb-4">
            Your order <span className="text-gold font-mono">{orderId}</span> has been placed successfully.
          </p>
          <p className="text-xs text-cream/25 mb-8">
            Our design team will contact you within 24 hours to confirm details.<br />
            Estimated delivery: 4-6 weeks
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setPage('orders')}
              className="px-6 py-3 rounded-xl border border-gold/20 text-gold text-sm hover:bg-gold/5 transition-colors"
            >
              View My Orders
            </button>
            <button
              onClick={() => setPage('shop')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold text-sm"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
