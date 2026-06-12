import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from './store/useShop';
import { useAuth } from './store/useAuth';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Toasts from './components/Toasts';
import LoginModal from './components/LoginModal';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Customizer from './pages/Customizer';
import Orders from './pages/Orders';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Hash ↔ Page mapping
const HASH_TO_PAGE: Record<string, string> = {
  '': 'home',
  '#home': 'home',
  '#shop': 'shop',
  '#wishlist': 'wishlist',
  '#checkout': 'checkout',
  '#customizer': 'customizer',
  '#orders': 'orders',
  '#admin': 'admin-login',
  '#admin-login': 'admin-login',
  '#admin-dashboard': 'admin',
};

const PAGE_TO_HASH: Record<string, string> = {
  'home': '',
  'shop': '#shop',
  'product': '#product',
  'wishlist': '#wishlist',
  'checkout': '#checkout',
  'customizer': '#customizer',
  'orders': '#orders',
  'admin-login': '#admin',
  'admin': '#admin-dashboard',
};

function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onDone, 400);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-navy flex flex-col items-center justify-center"
    >
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-spin-slow" />
        <div
          className="absolute inset-3 rounded-full border-2 border-transparent border-t-rose/60"
          style={{ animation: 'spin 2s linear infinite reverse' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading text-3xl text-gold font-bold">H</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8"
      >
        <h1 className="font-heading text-2xl text-cream tracking-wider">
          Heer's <span className="text-gold">Design</span>
        </h1>
        <p className="text-[10px] text-gold/40 tracking-[0.4em] uppercase mt-1">
          Luxury Atelier
        </p>
      </motion.div>

      <div className="w-48 h-0.5 bg-gold/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-gold to-rose rounded-full"
          style={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const { page, setPage } = useShop();
  useAuth(); // keep auth store active

  // Sync hash → page on initial load & hash changes
  const handleHashChange = useCallback(() => {
    const hash = window.location.hash || '';
    const targetPage = HASH_TO_PAGE[hash];
    if (targetPage && targetPage !== useShop.getState().page) {
      setPage(targetPage as Parameters<typeof setPage>[0]);
    }
  }, [setPage]);

  // On mount: read hash from URL
  useEffect(() => {
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [handleHashChange]);

  // Sync page → hash whenever page changes
  useEffect(() => {
    const targetHash = PAGE_TO_HASH[page] ?? '';
    if (window.location.hash !== targetHash) {
      // Use replaceState to avoid creating browser history on every page switch
      const url = targetHash || window.location.pathname;
      window.history.replaceState(null, '', url);
    }
  }, [page]);

  const isAdminPage = page === 'admin' || page === 'admin-login';

  const renderPage = () => {
    switch (page) {
      case 'home': return <Home />;
      case 'shop': return <Shop />;
      case 'product': return <ProductDetail />;
      case 'wishlist': return <Wishlist />;
      case 'checkout': return <Checkout />;
      case 'customizer': return <Customizer />;
      case 'orders': return <Orders />;
      case 'admin-login': return <AdminLogin />;
      case 'admin': return <AdminDashboard />;
      default: return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-navy text-cream">
      <AnimatePresence>
        {loading && <Loader onDone={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          {!isAdminPage && <Navbar />}
          <CartDrawer />
          <LoginModal />

          <AnimatePresence mode="wait" initial={false}>
            <motion.main
              key={page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {renderPage()}
            </motion.main>
          </AnimatePresence>

          {!isAdminPage && <Footer />}
          <Toasts />

          {!isAdminPage && <WhatsAppButton />}
        </>
      )}
    </div>
  );
}
