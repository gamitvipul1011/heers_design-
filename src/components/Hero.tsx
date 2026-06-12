import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../store/useShop';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setPage } = useShop();

  // Gold particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; decay: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Create initial particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.2,
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        decay: Math.random() * 0.003 + 0.001,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y < -10 || p.x < -10 || p.x > canvas.offsetWidth + 10) {
          p.x = Math.random() * canvas.offsetWidth;
          p.y = canvas.offsetHeight + 10;
          p.alpha = Math.random() * 0.5 + 0.2;
          p.vy = (Math.random() - 0.5) * 0.3 - 0.3;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const isGold = Math.random() > 0.3;
        ctx.fillStyle = isGold
          ? `rgba(212, 175, 55, ${p.alpha})`
          : `rgba(200, 87, 122, ${p.alpha * 0.6})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const title = "Draped in Stories, Woven in Gold.";

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy">
      {/* Canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-gold/[0.05] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy to-transparent pointer-events-none z-10" />

      {/* Floating images */}
      <div className="absolute top-20 right-[8%] w-48 h-64 rounded-2xl overflow-hidden shadow-2xl shadow-gold/10 animate-float hidden lg:block opacity-50 rotate-3">
        <img
          src="https://images.pexels.com/photos/15123420/pexels-photo-15123420.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=400"
          alt="Bridal fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
      </div>
      <div className="absolute bottom-32 right-[18%] w-40 h-56 rounded-2xl overflow-hidden shadow-2xl shadow-rose/10 animate-float-delayed hidden lg:block opacity-40 -rotate-6">
        <img
          src="https://images.pexels.com/photos/4048041/pexels-photo-4048041.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=400"
          alt="Saree fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
      </div>

      {/* Mandala ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-gold/[0.08] animate-spin-slow pointer-events-none hidden md:block">
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-gold/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-rose/30 rounded-full -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-0 w-2 h-2 bg-gold/20 rounded-full -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 right-0 w-2 h-2 bg-rose/20 rounded-full -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gold/[0.08] border border-gold/20 px-4 py-2 rounded-full mb-8"
          >
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            <span className="text-xs text-gold tracking-widest uppercase font-medium">
              New Collection 2026
            </span>
          </motion.div>

          {/* Title with letter animation */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] mb-8">
            {title.split(' ').map((word, wi) => (
              <span key={wi} className="inline-block mr-[0.3em]">
                {word.split('').map((letter, li) => (
                  <motion.span
                    key={`${wi}-${li}`}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + wi * 0.15 + li * 0.03,
                      ease: [0.215, 0.610, 0.355, 1.000],
                    }}
                    className={`inline-block ${
                      word === 'Gold.' ? 'gold-shimmer' : 'text-cream'
                    }`}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="text-lg text-cream/50 max-w-lg mb-10 leading-relaxed font-light"
          >
            Where centuries-old artistry meets contemporary elegance.
            Each piece handcrafted by India's finest master artisans.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => setPage('shop')}
              className="group px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold rounded-xl hover:shadow-lg hover:shadow-gold/25 transition-all duration-300 active:scale-[0.97] flex items-center gap-2"
            >
              Explore Collection
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button
              onClick={() => setPage('customizer')}
              className="px-8 py-4 border border-gold/30 text-gold rounded-xl hover:bg-gold/5 transition-all duration-300 font-medium"
            >
              Custom Design Studio
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-gold/40 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 border border-gold/20 rounded-full flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 bg-gold/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
