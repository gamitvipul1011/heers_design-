import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, type Order } from '../store/useAuth';
import { useShop } from '../store/useShop';
import type { Product, ProductColor } from '../data/products';
import type { Category } from '../data/categories';

// Reusable Image Upload Component
function ImageUploader({
  value,
  onChange,
  label,
  aspectClass = 'aspect-video',
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
  aspectClass?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) return;

      // Resize + compress before storing, so we don't blow past the
      // browser's localStorage quota (large photos saved as raw base64
      // were causing "Place Order" to silently fail for admin-added products).
      const img = new Image();
      img.onload = () => {
        const MAX_DIMENSION = 1000;
        let { width, height } = img;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          onChange(rawDataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // JPEG at 0.75 quality keeps photos looking good while shrinking
        // a multi-MB upload down to a few hundred KB.
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
        onChange(compressedDataUrl);
      };
      img.onerror = () => onChange(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <div>
      {label && <label className="text-xs text-cream/40 mb-1.5 block">{label}</label>}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
          e.target.value = '';
        }}
      />

      {value ? (
        /* Preview with replace/remove */
        <div className={`relative ${aspectClass} rounded-xl overflow-hidden group border border-gold/10`}>
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-navy/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 rounded-lg bg-gold/20 text-gold text-xs font-medium hover:bg-gold/30 transition-colors flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-4 py-2 rounded-lg bg-rose/20 text-rose text-xs font-medium hover:bg-rose/30 transition-colors flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Remove
            </button>
          </div>
          {/* File name badge */}
          <div className="absolute top-2 left-2 bg-emerald-500/20 text-emerald-300 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            Uploaded
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`${aspectClass} rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
            dragOver
              ? 'border-gold bg-gold/5 scale-[1.02]'
              : 'border-gold/15 hover:border-gold/30 hover:bg-white/[0.02]'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            dragOver ? 'bg-gold/20' : 'bg-white/5'
          }`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`transition-colors ${dragOver ? 'text-gold' : 'text-cream/25'}`}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <div className="text-center">
            <p className={`text-sm font-medium transition-colors ${dragOver ? 'text-gold' : 'text-cream/40'}`}>
              {dragOver ? 'Drop image here' : 'Click or drag image'}
            </p>
            <p className="text-[10px] text-cream/20 mt-0.5">JPG, PNG, WEBP supported</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Multiple image uploader — first image is the main product image
function MultiImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const updateAt = (i: number, val: string) => {
    if (!val) {
      onChange(images.filter((_, idx) => idx !== i));
    } else {
      const next = [...images];
      next[i] = val;
      onChange(next);
    }
  };

  return (
    <div>
      <label className="text-xs text-cream/40 mb-1.5 block">
        Product Images <span className="text-cream/20">(first photo is the main image)</span>
      </label>
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, i) => (
          <div key={i} className="relative">
            <ImageUploader value={img} onChange={(val) => updateAt(i, val)} aspectClass="aspect-square" />
            {i === 0 && (
              <span className="absolute top-1.5 left-1.5 z-10 bg-gold text-navy text-[9px] font-bold px-1.5 py-0.5 rounded">
                MAIN
              </span>
            )}
          </div>
        ))}
        <ImageUploader
          value=""
          onChange={(val) => {
            if (val) onChange([...images, val]);
          }}
          aspectClass="aspect-square"
        />
      </div>
    </div>
  );
}

// Colors editor — pick a color visually, name it, and optionally link a product image to it
function ColorsEditor({
  colors,
  images,
  onChange,
}: {
  colors: ProductColor[];
  images: string[];
  onChange: (colors: ProductColor[]) => void;
}) {
  const update = (i: number, patch: Partial<ProductColor>) => {
    const next = [...colors];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const remove = (i: number) => onChange(colors.filter((_, idx) => idx !== i));
  const add = () => onChange([...colors, { name: '', hex: '#D4AF37', image: '' }]);

  return (
    <div>
      <label className="text-xs text-cream/40 mb-1.5 block">Colors</label>
      <div className="space-y-2">
        {colors.map((c, i) => {
          const imgIndex = c.image ? images.indexOf(c.image) : -1;
          return (
            <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-gold/10">
              <input
                type="color"
                value={c.hex}
                onChange={(e) => update(i, { hex: e.target.value })}
                title="Pick color"
                className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border border-gold/10 p-0.5 shrink-0"
              />
              <input
                value={c.name}
                onChange={(e) => update(i, { name: e.target.value })}
                placeholder="Color name"
                className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30 placeholder:text-cream/15"
              />
              <select
                value={imgIndex >= 0 ? String(imgIndex) : ''}
                onChange={(e) =>
                  update(i, { image: e.target.value === '' ? undefined : images[Number(e.target.value)] })
                }
                className="w-28 shrink-0 px-2 py-2 rounded-lg bg-white/5 border border-gold/10 text-cream text-xs focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-navy">No image</option>
                {images.map((_, idx) => (
                  <option key={idx} value={idx} className="bg-navy">
                    Photo {idx + 1}{idx === 0 ? ' (Main)' : ''}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => remove(i)}
                className="p-2 rounded-lg bg-rose/10 text-rose hover:bg-rose/20 transition-colors shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 text-xs text-gold hover:underline"
      >
        + Add Color
      </button>
      {!!images.length && (
        <p className="text-[10px] text-cream/20 mt-1.5">
          Linking a photo to a color shows that photo when the customer taps that color on the product page.
        </p>
      )}
    </div>
  );
}

const STATUS_OPTIONS: Order['status'][] = ['placed', 'confirmed', 'in_production', 'shipped', 'delivered'];
const STATUS_LABELS: Record<string, string> = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  in_production: 'In Production',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

type Tab = 'overview' | 'orders' | 'products' | 'categories';

export default function AdminDashboard() {
  const { orders, updateOrderStatus, isAdminLoggedIn, adminLogout } = useAuth();
  const { setPage, addToast, products: productsList, categories, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory } = useShop();
  const [tab, setTab] = useState<Tab>('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdminLoggedIn) {
      setPage('admin-login');
    }
  }, [isAdminLoggedIn, setPage]);

  if (!isAdminLoggedIn) {
    return null;
  }

  // Stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status !== 'delivered').length;
  const customOrders = orders.filter((o) => o.items.some((i) => i.isCustom)).length;

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    addToast(`Order ${orderId} updated to ${STATUS_LABELS[status]}`, 'success');
  };

  const handleDeleteProduct = (id: number) => {
    deleteProduct(id);
    addToast('Product deleted', 'info');
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      updateProduct(product);
      addToast('Product updated', 'success');
    } else {
      addProduct(product);
      addToast('Product added', 'success');
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
    addToast('Category deleted', 'info');
  };

  const handleSaveCategory = (category: Category) => {
    if (editingCategory) {
      updateCategory(category);
      addToast('Category updated', 'success');
    } else {
      addCategory(category);
      addToast('Category added', 'success');
    }
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  const handleLogout = () => {
    adminLogout();
    setPage('home');
    addToast('Admin logged out', 'info');
  };

  // Count products per category
  const getCategoryProductCount = (categorySlug: string) => {
    return productsList.filter((p) => p.category === categorySlug).length;
  };

  return (
    <div className="min-h-screen bg-navy-dark">
      {/* Header */}
      <div className="bg-navy border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h1 className="font-heading text-lg text-cream">Admin Dashboard</h1>
              <p className="text-[10px] text-cream/40">Heer's Design Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage('home')}
              className="text-sm text-cream/40 hover:text-cream transition-colors"
            >
              View Store →
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-rose/30 text-rose text-sm hover:bg-rose/5 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['overview', 'orders', 'products', 'categories'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                tab === t
                  ? 'bg-gold text-navy'
                  : 'text-cream/50 hover:text-cream hover:bg-white/5'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Orders', value: totalOrders, icon: '📦', color: 'gold' },
                { label: 'Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: '💰', color: 'emerald' },
                { label: 'Pending', value: pendingOrders, icon: '⏳', color: 'amber' },
                { label: 'Custom Orders', value: customOrders, icon: '🎨', color: 'rose' },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <p className="font-heading text-2xl text-cream mb-1">{stat.value}</p>
                  <p className="text-xs text-cream/40">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-heading text-lg text-cream mb-4">Products by Category</h3>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between">
                      <span className="text-sm text-cream/60">{cat.name}</span>
                      <span className="text-sm text-gold font-medium">{getCategoryProductCount(cat.slug)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-heading text-lg text-cream mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                    className="p-4 rounded-xl bg-gold/10 text-gold text-sm font-medium hover:bg-gold/20 transition-colors"
                  >
                    + Add Product
                  </button>
                  <button
                    onClick={() => { setEditingCategory(null); setShowCategoryModal(true); }}
                    className="p-4 rounded-xl bg-rose/10 text-rose text-sm font-medium hover:bg-rose/20 transition-colors"
                  >
                    + Add Category
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="glass rounded-2xl p-6">
              <h2 className="font-heading text-lg text-cream mb-4">Recent Orders</h2>
              {orders.length === 0 ? (
                <p className="text-sm text-cream/40 py-8 text-center">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                          <span className="text-sm">{order.items.some(i => i.isCustom) ? '🎨' : '📦'}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-cream">{order.id}</p>
                          <p className="text-xs text-cream/40">{order.userName} · {order.items.length} items</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gold font-heading">₹{order.total.toLocaleString('en-IN')}</p>
                        <p className={`text-[10px] ${
                          order.status === 'delivered' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {STATUS_LABELS[order.status]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {orders.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <p className="text-cream/40">No orders to display</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="glass rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-gold/10">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-mono text-gold font-medium">{order.id}</p>
                            <p className="text-xs text-cream/40 mt-0.5">
                              {new Date(order.createdAt).toLocaleString('en-IN')}
                            </p>
                          </div>
                          {order.items.some((i) => i.isCustom) && (
                            <span className="px-2 py-1 rounded-full bg-rose/10 text-rose text-[10px] font-bold">
                              CUSTOM ORDER
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                            className="px-3 py-2 rounded-lg bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none cursor-pointer"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s} className="bg-navy">{STATUS_LABELS[s]}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-4 py-2 rounded-lg border border-gold/20 text-gold text-sm hover:bg-gold/5 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-xs text-cream/40 mb-1">Customer</p>
                          <p className="text-sm text-cream">{order.userName}</p>
                          <p className="text-xs text-cream/50">{order.userEmail}</p>
                        </div>
                        <div>
                          <p className="text-xs text-cream/40 mb-1">Shipping</p>
                          <p className="text-sm text-cream/70">
                            {order.shipping.address}, {order.shipping.city} {order.shipping.pincode}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-cream/40 mb-1">Total</p>
                          <p className="font-heading text-xl text-gold">₹{order.total.toLocaleString('en-IN')}</p>
                          <p className="text-[10px] text-cream/40">{order.paymentMethod.toUpperCase()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Products */}
        {tab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-cream/40">{productsList.length} products</p>
              <button
                onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all flex items-center gap-2"
              >
                <span>+</span> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsList.map((product) => (
                <div key={product.id} className="glass rounded-2xl overflow-hidden group">
                  <div className="relative aspect-[3/4]">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => { setEditingProduct(product); setShowProductModal(true); }}
                        className="p-3 rounded-xl bg-gold/20 text-gold hover:bg-gold/30 transition-colors"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-3 rounded-xl bg-rose/20 text-rose hover:bg-rose/30 transition-colors"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-gold/60 uppercase tracking-wider">{product.fabric}</p>
                    <h3 className="font-heading text-cream truncate">{product.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gold">₹{product.price.toLocaleString('en-IN')}</p>
                      <span className="text-[10px] text-cream/30 bg-white/5 px-2 py-0.5 rounded">{product.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Categories */}
        {tab === 'categories' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-cream/40">{categories.length} categories</p>
              <button
                onClick={() => { setEditingCategory(null); setShowCategoryModal(true); }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold text-sm hover:shadow-lg hover:shadow-rose/20 transition-all flex items-center gap-2"
              >
                <span>+</span> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="glass rounded-2xl overflow-hidden group">
                  <div className="relative aspect-video">
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
                    <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => { setEditingCategory(category); setShowCategoryModal(true); }}
                        className="p-3 rounded-xl bg-gold/20 text-gold hover:bg-gold/30 transition-colors"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-3 rounded-xl bg-rose/20 text-rose hover:bg-rose/30 transition-colors"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-heading text-lg text-cream">{category.name}</h3>
                      <p className="text-xs text-cream/50 mt-1">{category.description}</p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gold/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-cream/40">Slug: {category.slug}</span>
                      <span className="text-xs text-gold bg-gold/10 px-2 py-1 rounded-full">
                        {getCategoryProductCount(category.slug)} products
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[81] w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl text-cream">Order {selectedOrder.id}</h2>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-xl hover:bg-white/5">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cream/40">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.02]">
                      <div className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-24 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="text-cream font-medium">{item.name}</p>
                          <p className="text-xs text-cream/40">{item.color} · {item.size} · Qty: {item.quantity}</p>
                          <p className="text-gold mt-1">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                          
                          {item.isCustom && item.customDetails && (
                            <div className="mt-3 p-3 rounded-lg bg-rose/5 border border-rose/10">
                              <p className="text-[10px] text-rose uppercase tracking-wider font-bold mb-2">Custom Design Details</p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-cream/40">Garment:</span>
                                  <span className="text-cream ml-1">{item.customDetails.garment}</span>
                                </div>
                                <div>
                                  <span className="text-cream/40">Fabric:</span>
                                  <span className="text-cream ml-1">{item.customDetails.fabric}</span>
                                </div>
                                <div>
                                  <span className="text-cream/40">Color:</span>
                                  <span className="text-cream ml-1">{item.customDetails.color}</span>
                                </div>
                                <div>
                                  <span className="text-cream/40">Size:</span>
                                  <span className="text-cream ml-1">{item.customDetails.size}</span>
                                </div>
                              </div>
                              {item.customDetails.description && (
                                <div className="mt-2">
                                  <span className="text-cream/40 text-xs">Description:</span>
                                  <p className="text-cream/70 text-xs mt-1">{item.customDetails.description}</p>
                                </div>
                              )}
                              {item.customDetails.referenceImage && (
                                <div className="mt-2">
                                  <span className="text-cream/40 text-xs">Reference Image:</span>
                                  <img src={item.customDetails.referenceImage} alt="Reference" className="w-24 h-24 rounded-lg object-cover mt-1" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gold/10">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-cream/40 mb-1">Customer</p>
                      <p className="text-cream">{selectedOrder.userName}</p>
                      <p className="text-cream/50 text-xs">{selectedOrder.userEmail}</p>
                      <p className="text-cream/50 text-xs">{selectedOrder.shipping.phone}</p>
                    </div>
                    <div>
                      <p className="text-cream/40 mb-1">Shipping Address</p>
                      <p className="text-cream/70 text-xs">
                        {selectedOrder.shipping.address}<br />
                        {selectedOrder.shipping.city}, {selectedOrder.shipping.state} {selectedOrder.shipping.pincode}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-cream/40">Payment: {selectedOrder.paymentMethod.toUpperCase()}</p>
                    <p className="font-heading text-xl text-gold">₹{selectedOrder.total.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <ProductModal
        isOpen={showProductModal}
        onClose={() => { setShowProductModal(false); setEditingProduct(null); }}
        product={editingProduct}
        categories={categories}
        onSave={handleSaveProduct}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => { setShowCategoryModal(false); setEditingCategory(null); }}
        category={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
}

// Product Edit/Add Modal
function ProductModal({
  isOpen,
  onClose,
  product,
  categories,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  onSave: (product: Product) => void;
}) {
  const emptyForm: Partial<Product> = {
    name: '',
    price: 0,
    fabric: '',
    category: 'saree',
    description: '',
    image: '',
    images: [],
    colors: [{ name: 'Gold', hex: '#D4AF37', image: '' }],
    sizes: ['S', 'M', 'L'],
    featured: false,
    rating: 4.5,
    reviews: 0,
  };

  const [form, setForm] = useState<Partial<Product>>(product || emptyForm);
  const [sizesInput, setSizesInput] = useState((form.sizes || []).join(', '));

  // Reset form whenever product prop changes (open for edit vs add)
  useEffect(() => {
    if (isOpen) {
      const init = product || emptyForm;
      setForm(init);
      setSizesInput((init.sizes || []).join(', '));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, product?.id]);

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[81] w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass rounded-3xl p-6">
          <h2 className="font-heading text-xl text-cream mb-6">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-cream/40 mb-1.5 block">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-cream/40 mb-1.5 block">Price (₹)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30"
                />
              </div>
              <div>
                <label className="text-xs text-cream/40 mb-1.5 block">Old Price (₹) — optional</label>
                <input
                  type="number"
                  value={form.originalPrice ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      originalPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  placeholder="e.g. MRP before discount"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30 placeholder:text-cream/15"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-cream/40 mb-1.5 block">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as Product['category'] })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug} className="bg-navy">{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-cream/40 mb-1.5 block">Rating (0–5)</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={form.rating ?? 0}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-cream/40 mb-1.5 block">Fabric</label>
              <input
                value={form.fabric}
                onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30"
              />
            </div>
            <div>
              <label className="text-xs text-cream/40 mb-1.5 block">Sizes (comma separated)</label>
              <input
                value={sizesInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setSizesInput(val);
                  setForm({
                    ...form,
                    sizes: val.split(',').map((s) => s.trim()).filter(Boolean),
                  });
                }}
                placeholder="e.g. S, M, L, XL or Free Size"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30 placeholder:text-cream/15"
              />
              {!!form.sizes?.length && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.sizes.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-gold/10 text-[11px] text-cream/50">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <ColorsEditor
              colors={form.colors || []}
              images={form.images || []}
              onChange={(colors) => setForm({ ...form, colors })}
            />
            <MultiImageUploader
              images={form.images || []}
              onChange={(images) =>
                setForm({ ...form, images, image: images[0] || '' })
              }
            />
            <div>
              <label className="text-xs text-cream/40 mb-1.5 block">Story / Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Tell the story behind this piece..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30 resize-none placeholder:text-cream/15"
              />
            </div>
            <div>
              <label className="text-xs text-cream/40 mb-1.5 block">Fabric & Care Details (Fabric tab on product page)</label>
              <div className="space-y-2">
                <input
                  value={form.fabricInfo?.material || ''}
                  onChange={(e) => setForm({ ...form, fabricInfo: { ...form.fabricInfo, material: e.target.value } })}
                  placeholder={`Material (e.g. ${form.fabric || 'Pure Banarasi Silk'})`}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30 placeholder:text-cream/15"
                />
                <input
                  value={form.fabricInfo?.weight || ''}
                  onChange={(e) => setForm({ ...form, fabricInfo: { ...form.fabricInfo, weight: e.target.value } })}
                  placeholder="Weight (e.g. Approximately 800g)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30 placeholder:text-cream/15"
                />
                <input
                  value={form.fabricInfo?.weave || ''}
                  onChange={(e) => setForm({ ...form, fabricInfo: { ...form.fabricInfo, weave: e.target.value } })}
                  placeholder="Weave (e.g. Handwoven with traditional techniques)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30 placeholder:text-cream/15"
                />
                <input
                  value={form.fabricInfo?.origin || ''}
                  onChange={(e) => setForm({ ...form, fabricInfo: { ...form.fabricInfo, origin: e.target.value } })}
                  placeholder="Origin (e.g. Crafted by master artisans in India)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30 placeholder:text-cream/15"
                />
              </div>
              <p className="text-[10px] text-cream/20 mt-1.5">Leave any field blank to use the default text shown in the placeholder.</p>
            </div>
            <div>
              <label className="text-xs text-cream/40 mb-1.5 block">Care Instructions <span className="text-cream/20">(one point per line)</span></label>
              <textarea
                value={form.careInstructions || ''}
                onChange={(e) => setForm({ ...form, careInstructions: e.target.value })}
                rows={3}
                placeholder={'Dry clean only\nStore in a cool, dry place\nIron on low heat'}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30 resize-none placeholder:text-cream/15"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 rounded border-gold/30"
              />
              <span className="text-sm text-cream/60">Featured Product</span>
            </label>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gold/20 text-cream/60 text-sm hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!form.name?.trim()) { alert('Product name is required'); return; }
                if (!form.price || form.price <= 0) { alert('Please enter a valid price'); return; }
                if (!form.image && !form.images?.length) { alert('Please upload at least one product image'); return; }
                // Ensure colors have image set (fallback to first product image)
                const firstImg = form.images?.[0] || form.image || '';
                const fixedColors = (form.colors || []).map((c) => ({
                  ...c,
                  image: c.image || firstImg,
                }));
                onSave({ ...form, colors: fixedColors, image: form.images?.[0] || form.image || '' } as Product);
              }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold text-sm"
            >
              {product ? 'Update' : 'Add'} Product
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// Category Edit/Add Modal
function CategoryModal({
  isOpen,
  onClose,
  category,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (category: Category) => void;
}) {
  const [form, setForm] = useState<Partial<Category>>(
    category || { name: '', slug: '', description: '', image: '' }
  );

  useEffect(() => {
    if (isOpen) {
      setForm(category || { name: '', slug: '', description: '', image: '' });
    }
  }, [isOpen, category?.id]);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm({ ...form, name, slug: category ? form.slug : slug });
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[81] w-full max-w-md max-h-[90vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass rounded-3xl p-6">
          <h2 className="font-heading text-xl text-cream mb-6">
            {category ? 'Edit Category' : 'Add Category'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-cream/40 mb-1.5 block">Category Name</label>
              <input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30"
                placeholder="e.g., Wedding Collection"
              />
            </div>
            <div>
              <label className="text-xs text-cream/40 mb-1.5 block">Slug (URL-friendly)</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30"
                placeholder="e.g., wedding-collection"
              />
            </div>
            <div>
              <label className="text-xs text-cream/40 mb-1.5 block">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30 resize-none"
                placeholder="Brief description of this category..."
              />
            </div>
            <ImageUploader
              label="Category Image"
              value={form.image || ''}
              onChange={(dataUrl) => setForm({ ...form, image: dataUrl })}
              aspectClass="aspect-video"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gold/20 text-cream/60 text-sm hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(form as Category)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold text-sm"
            >
              {category ? 'Update' : 'Add'} Category
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
