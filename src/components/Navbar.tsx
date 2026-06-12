import { useState, useEffect } from 'react';
import { useShop } from '../store/useShop';
import { useAuth } from '../store/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { page, setPage, cart, wishlist, toggleCart } = useShop();
  const { isLoggedIn, user, setShowLoginModal, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const close = () => setUserMenuOpen(false);
    if (userMenuOpen) {
      document.addEventListener('click', close);
      return () => document.removeEventListener('click', close);
    }
  }, [userMenuOpen]);

  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const navLinks: { label: string; target: 'home' | 'shop' | 'wishlist' | 'customizer' | 'orders' }[] = [
    { label: 'Home', target: 'home' },
    { label: 'Shop', target: 'shop' },
    { label: 'Custom Design', target: 'customizer' },
    ...(isLoggedIn ? [{ label: 'My Orders', target: 'orders' as const }] : []),
    { label: 'Wishlist', target: 'wishlist' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-navy/90 backdrop-blur-xl shadow-lg shadow-black/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setPage('home')}
          className="flex items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center group-hover:bg-gold/10 transition-all duration-300">
            <span className="font-heading text-gold text-lg font-bold">H</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-heading text-xl text-cream tracking-wide">
              Heer's <span className="text-gold">Design</span>
            </h1>
            <p className="text-[9px] text-gold-light/60 tracking-[0.3em] uppercase -mt-1">
              Luxury Atelier
            </p>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => setPage(link.target)}
              className={`relative text-sm font-medium transition-colors duration-300 ${
                page === link.target ? 'text-gold' : 'text-cream/70 hover:text-cream'
              }`}
            >
              {link.label}
              {link.target === 'wishlist' && wishlist.length > 0 && (
                <span className="absolute -top-2 -right-4 w-4 h-4 bg-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
              {page === link.target && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-rose"
                />
              )}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* User */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isLoggedIn) {
                  setUserMenuOpen(!userMenuOpen);
                } else {
                  setShowLoginModal(true);
                }
              }}
              className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
            >
              {isLoggedIn && user ? (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-rose flex items-center justify-center">
                  <span className="text-navy text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-cream/80 group-hover:text-gold transition-colors">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              )}
            </button>

            {/* User dropdown */}
            <AnimatePresence>
              {userMenuOpen && isLoggedIn && user && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-56 glass rounded-2xl p-2 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-3 border-b border-gold/10 mb-2">
                    <p className="text-sm font-semibold text-cream">{user.name}</p>
                    <p className="text-xs text-cream/40">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setPage('orders'); setUserMenuOpen(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-cream/70 hover:bg-white/5 hover:text-cream transition-colors flex items-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    My Orders
                  </button>
                  <button
                    onClick={() => { setPage('wishlist'); setUserMenuOpen(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-cream/70 hover:bg-white/5 hover:text-cream transition-colors flex items-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    Wishlist
                  </button>
                  <div className="h-px bg-gold/10 my-2" />
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-rose/70 hover:bg-rose/5 hover:text-rose transition-colors flex items-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart */}
          <button
            onClick={toggleCart}
            className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-cream/80 group-hover:text-gold transition-colors">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-gold to-rose text-navy text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-cream/80">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="16" y2="12" />
                  <line x1="4" y1="17" x2="12" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-navy/95 backdrop-blur-xl border-t border-gold/10"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.target}
                  onClick={() => {
                    setPage(link.target);
                    setMobileOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    page === link.target
                      ? 'bg-gold/10 text-gold'
                      : 'text-cream/70 hover:text-cream hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {link.target === 'wishlist' && wishlist.length > 0 && (
                    <span className="ml-2 text-rose text-xs">({wishlist.length})</span>
                  )}
                </button>
              ))}
              <div className="h-px bg-gold/10 my-2" />
              {!isLoggedIn && (
                <button
                  onClick={() => { setShowLoginModal(true); setMobileOpen(false); }}
                  className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gold hover:bg-gold/5 transition-colors"
                >
                  Login / Register
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
