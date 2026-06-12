import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../store/useAuth';
import { useShop } from '../store/useShop';

export default function AdminLogin() {
  const { adminLogin, verifyAdminOtp, adminPendingOtp, isAdminLoggedIn } = useAuth();
  const { setPage, addToast } = useShop();
  const [form, setForm] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in — useEffect so it doesn't fire during render
  useEffect(() => {
    if (isAdminLoggedIn) {
      setPage('admin');
    }
  }, [isAdminLoggedIn, setPage]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const success = adminLogin(form.email, form.password);
    if (!success) {
      setError('Invalid admin credentials');
    }
    setLoading(false);
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const success = verifyAdminOtp(otp);
    if (success) {
      addToast('Welcome to Admin Dashboard', 'success');
      // setPage will be called by the useEffect above when isAdminLoggedIn changes
    } else {
      setError('Invalid OTP code');
    }
    setLoading(false);
  };

  // Don't render if already admin (transitioning)
  if (isAdminLoggedIn) return null;

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h1 className="font-heading text-2xl text-cream mb-1">Admin Portal</h1>
            <p className="text-sm text-cream/40">
              {adminPendingOtp ? 'Enter verification code' : 'Secure admin access'}
            </p>
          </div>

          {!adminPendingOtp ? (
            // Step 1: Credentials
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-cream/40 mb-1.5 block">Admin Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/10 text-cream text-sm focus:outline-none focus:border-gold/30"
                  placeholder="admin@heers.com"
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
                />
              </div>

              {error && <p className="text-rose text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold hover:shadow-lg hover:shadow-rose/20 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Continue →'
                )}
              </button>
            </form>
          ) : (
            // Step 2: OTP
            <form onSubmit={handleOtp} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p className="text-sm text-cream/60">
                  Credentials verified! Enter the 6-digit OTP code.
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-4 rounded-xl bg-white/5 border border-gold/10 text-cream text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:border-gold/30"
                  placeholder="• • • • • •"
                  maxLength={6}
                  autoFocus
                  required
                />
              </div>

              {error && <p className="text-rose text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Verify & Login'
                )}
              </button>
            </form>
          )}

          {/* Demo hint */}
          <div className="mt-6 p-3 rounded-xl bg-rose/5 border border-rose/10">
            <p className="text-[10px] text-rose/60 text-center leading-relaxed">
              {adminPendingOtp
                ? '🔑 Demo OTP: 246810'
                : '🔑 Demo: admin@heers.com / admin123'}
            </p>
          </div>

          {/* Back link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setPage('home')}
              className="text-sm text-cream/30 hover:text-cream/50 transition-colors"
            >
              ← Back to Store
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
