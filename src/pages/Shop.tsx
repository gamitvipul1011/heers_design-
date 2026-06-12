import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../store/useShop';
import ProductCard from '../components/ProductCard';

type SortBy = 'featured' | 'price-low' | 'price-high' | 'rating';

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹20,000', min: 0, max: 20000 },
  { label: '₹20,000 – ₹50,000', min: 20000, max: 50000 },
  { label: '₹50,000 – ₹1,00,000', min: 50000, max: 100000 },
  { label: 'Over ₹1,00,000', min: 100000, max: Infinity },
];

export default function Shop() {
  const { products, categories: storeCategories } = useShop();
  const CATEGORIES = [
    { value: 'all', label: 'All' },
    ...storeCategories.map((c) => ({ value: c.slug, label: c.name })),
  ];
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortBy>('featured');
  const [priceRange, setPriceRange] = useState(0);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = [...products];

    // Category filter
    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    // Price filter
    const range = PRICE_RANGES[priceRange];
    result = result.filter((p) => p.price >= range.min && p.price < range.max);

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [category, sortBy, priceRange, search]);

  return (
    <div className="min-h-screen bg-navy pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xs text-gold tracking-[0.3em] uppercase mb-3">Collection</p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream mb-4">The Atelier</h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-rose mx-auto" />
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="sticky top-20 z-30 glass rounded-2xl p-4 mb-10"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full md:w-auto">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/30">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, fabric..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm placeholder:text-cream/20 focus:outline-none focus:border-gold/30"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-1.5 overflow-x-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    category === cat.value
                      ? 'bg-gold text-navy'
                      : 'text-cream/50 hover:text-cream hover:bg-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Price */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="px-3 py-2.5 rounded-xl bg-white/5 border border-gold/10 text-cream text-xs focus:outline-none cursor-pointer"
            >
              {PRICE_RANGES.map((r, i) => (
                <option key={i} value={i} className="bg-navy text-cream">
                  {r.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-2.5 rounded-xl bg-white/5 border border-gold/10 text-cream text-xs focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-navy">Featured</option>
              <option value="price-low" className="bg-navy">Price: Low → High</option>
              <option value="price-high" className="bg-navy">Price: High → Low</option>
              <option value="rating" className="bg-navy">Top Rated</option>
            </select>
          </div>
        </motion.div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-cream/30">
            {filtered.length} piece{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={`${category}-${sortBy}-${priceRange}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gold/5 flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/30">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <p className="text-cream/40 text-sm">No pieces match your filters</p>
              <button
                onClick={() => { setCategory('all'); setPriceRange(0); setSearch(''); }}
                className="mt-4 text-gold text-sm hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
