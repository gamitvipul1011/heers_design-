import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../store/useAuth';
import { useShop } from '../store/useShop';

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, login, register, isLoggedIn, user, logout } = useAuth();
  const { addToast } = useShop();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    if (mode === 'login') {
      const success = login(form.email, form.password);
      if (success) {
        addToast('Welcome back! 🎉', 'success');
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (!form.name.trim()) {
        setError('Please enter your name');
        setLoading(false);
        return;
      }
      const success = register(form.name, form.email, form.password);
      if (success) {
        addToast('Account created! Welcome to Heer\'s Design 🎉', 'success');
      } else {
        setError('Email already registered');
      }
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    setShowLoginModal(false);
    addToast('Logged out successfully', 'info');
  };

  return (
    <AnimatePresence>
      {showLoginModal && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[81] w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass rounded-3xl p-8 mx-4">
              {/* Close button */}
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-cream/40">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {isLoggedIn && user ? (
                // Logged in state
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gold to-rose flex items-center justify-center mb-4">
                    <span className="font-heading text-3xl text-navy font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl text-cream mb-1">{user.name}</h2>
                  <p className="text-sm text-cream/40 mb-6">{user.email}</p>

                  <div className="space-y-3">
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 rounded-xl border border-rose/30 text-rose text-sm font-medium hover:bg-rose/5 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                // Login/Register form
                <>
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 mx-auto rounded-full border-2 border-gold flex items-center justify-center mb-4">
                      <span className="font-heading text-gold text-xl font-bold">H</span>
                    </div>
                    <h2 className="font-heading text-2xl text-cream mb-1">
                      {mode === 'login' ? 'Welcome Back' : 'Join Heer\'s'}
                    </h2>
                    <p className="text-sm text-cream/40">
                      {mode === 'login' ? 'Sign in to your account' : 'Create your luxury account'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                      <div>
                        <label className="text-xs text-cream/40 mb-1.5 block">Full Name</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30"
                          placeholder="Your Name"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-xs text-cream/40 mb-1.5 block">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs text-cream/40 mb-1.5 block">Password</label>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>

                    {error && (
                      <p className="text-rose text-sm text-center">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold hover:shadow-lg hover:shadow-gold/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                      ) : mode === 'login' ? (
                        'Sign In'
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-cream/30">
                      {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                      <button
                        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                        className="text-gold ml-1 hover:underline"
                      >
                        {mode === 'login' ? 'Register' : 'Sign In'}
                      </button>
                    </p>
                  </div>

                  {/* Demo credentials hint */}
                  <div className="mt-6 p-3 rounded-xl bg-gold/5 border border-gold/10">
                    <p className="text-[10px] text-gold/60 text-center">
                      Demo: user@heers.com / password
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
