import { useState, useEffect, useRef, useCallback } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const COLLECTIONS = [
  { id: 1, name: "Suits", icon: "🕴", count: 24, color: "#C8A96E" },
  { id: 2, name: "Blazers", icon: "🧥", count: 18, color: "#8B7355" },
  { id: 3, name: "Shirts", icon: "👔", count: 36, color: "#5C6BC0" },
  { id: 4, name: "T-Shirts", icon: "👕", count: 42, color: "#42A5F5" },
  { id: 5, name: "Traditional", icon: "🎽", count: 15, color: "#EF5350" },
];

const PRODUCTS = [
  { id: 1, name: "Midnight Sovereign Suit", price: 890, originalPrice: 1200, category: "Suits", color: "#1a1a2e", tag: "Best Seller", sizes: ["S","M","L","XL"], img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80" },
  { id: 2, name: "Ivory Linen Blazer", price: 420, originalPrice: 580, category: "Blazers", color: "#F5F5DC", tag: "New", sizes: ["M","L","XL","XXL"], img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { id: 3, name: "Oxford Classic Shirt", price: 145, originalPrice: 195, category: "Shirts", color: "#FFFFFF", tag: "Trending", sizes: ["S","M","L"], img: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&q=80" },
  { id: 4, name: "Heritage Tweed Suit", price: 1150, originalPrice: 1500, category: "Suits", color: "#6B5B45", tag: "Premium", sizes: ["M","L","XL"], img: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&q=80" },
  { id: 5, name: "Cobalt Slim Shirt", price: 175, originalPrice: 220, category: "Shirts", color: "#002147", tag: "New", sizes: ["S","M","L","XL"], img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80" },
  { id: 6, name: "Royal Sherwani", price: 680, originalPrice: 900, category: "Traditional", color: "#8B0000", tag: "Exclusive", sizes: ["M","L","XL"], img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80" },
  { id: 7, name: "Slate Graphic Tee", price: 65, originalPrice: 85, category: "T-Shirts", color: "#708090", tag: "Trending", sizes: ["S","M","L","XL","XXL"], img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80" },
  { id: 8, name: "Charcoal Double Breasted", price: 975, originalPrice: 1300, category: "Suits", color: "#36454F", tag: "Premium", sizes: ["L","XL","XXL"], img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80" },
];

const REVIEWS = [
  { id: 1, name: "Alexander W.", role: "CEO, London", rating: 5, text: "The Midnight Sovereign suit is an absolute masterpiece. The craftsmanship is unparalleled — I wore it to a board meeting and received more compliments than I can count.", avatar: "AW" },
  { id: 2, name: "James R.", role: "Architect, NYC", rating: 5, text: "Finally, a brand that understands what modern luxury means. The fit, the fabric, the finish — everything is perfect. My go-to for every important occasion.", avatar: "JR" },
  { id: 3, name: "Marcus T.", role: "Creative Director", rating: 5, text: "I've worn suits from Savile Row to Milan, and NOIR stands shoulder to shoulder with the best. Exceptional quality at a fraction of the price.", avatar: "MT" },
  { id: 4, name: "David K.", role: "Barrister, Dubai", rating: 5, text: "The Traditional Sherwani collection is breathtaking. They've managed to honor heritage while bringing it firmly into the 21st century. Extraordinary work.", avatar: "DK" },
];

const HERO_SLIDES = [
  { title: "The Art of", accent: "Distinction", sub: "Where every thread tells your story", cta: "Explore Collection", bg: "from-[#0a0a0f] via-[#0d1117] to-[#0a0a0f]", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80" },
  { title: "Redefine Your", accent: "Presence", sub: "Crafted for those who command rooms", cta: "Shop Suits", bg: "from-[#0f0a05] via-[#1a1000] to-[#0f0a05]", img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80" },
  { title: "Heritage Meets", accent: "Modernity", sub: "Timeless styles for the discerning man", cta: "New Arrivals", bg: "from-[#050a0f] via-[#0a1020] to-[#050a0f]", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useScrollY() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return scrollY;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5, o: Math.random() * 0.4 + 0.1
    }));
    let raf;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,169,110,${p.o})`;
        ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(200,169,110,${0.08 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    }
    draw();
    const ro = new ResizeObserver(() => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; });
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />;
}

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= rating ? "#C8A96E" : "none"} stroke="#C8A96E" strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </div>
  );
}

function ProductCard({ product, index }) {
  const [ref, inView] = useInView(0.1);
  const [hovered, setHovered] = useState(false);
  const [cart, setCart] = useState(false);

  return (
    <div
      ref={ref}
      className="group relative"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) rotateX(0deg)" : "translateY(60px) rotateX(8deg)",
        transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 100}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden rounded-2xl cursor-pointer"
        style={{
          background: "linear-gradient(145deg, #141414, #0d0d0d)",
          border: "1px solid rgba(200,169,110,0.12)",
          boxShadow: hovered ? "0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,169,110,0.25), inset 0 1px 0 rgba(255,255,255,0.05)" : "0 8px 24px rgba(0,0,0,0.3)",
          transform: hovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Tag */}
        {product.tag && (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 text-xs font-bold tracking-widest uppercase" style={{ background: "linear-gradient(90deg, #C8A96E, #A07840)", borderRadius: 6, color: "#000" }}>
            {product.tag}
          </div>
        )}
        {/* Wishlist */}
        <button className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: 280 }}>
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700"
            style={{ transform: hovered ? "scale(1.1)" : "scale(1)", filter: hovered ? "brightness(0.85)" : "brightness(0.75)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)" }} />
          {/* Quick view overlay */}
          <div className="absolute inset-0 flex items-center justify-center transition-all duration-300" style={{ opacity: hovered ? 1 : 0 }}>
            <button className="px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-300"
              style={{ background: "rgba(200,169,110,0.9)", backdropFilter: "blur(8px)", borderRadius: 50, color: "#000", transform: hovered ? "translateY(0)" : "translateY(12px)" }}>
              Quick View
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "#C8A96E" }}>{product.category}</p>
          <h3 className="font-bold mb-2 text-sm leading-tight" style={{ color: "#F0EDE8", fontFamily: "'Cormorant Garamond', serif", fontSize: 16 }}>{product.name}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-base" style={{ color: "#C8A96E" }}>${product.price}</span>
              <span className="text-xs line-through" style={{ color: "#555" }}>${product.originalPrice}</span>
            </div>
            <button
              onClick={() => { setCart(true); setTimeout(() => setCart(false), 1500); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300"
              style={{
                background: cart ? "linear-gradient(90deg, #22c55e, #16a34a)" : "linear-gradient(90deg, #C8A96E, #A07840)",
                color: "#000",
                transform: hovered ? "scale(1.05)" : "scale(1)",
              }}
            >
              {cart ? "✓ Added" : "+ Cart"}
            </button>
          </div>
          {/* Sizes */}
          <div className="flex gap-1.5 mt-3">
            {product.sizes.map(s => (
              <span key={s} className="text-xs px-2 py-0.5 rounded cursor-pointer transition-all duration-200 hover:border-amber-400 hover:text-amber-400"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#888", borderRadius: 4 }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CollectionCard({ col, index }) {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref} className="flex-shrink-0" style={{ width: 200 }}>
      <div
        className="cursor-pointer relative overflow-hidden rounded-2xl p-6 flex flex-col items-center gap-3 transition-all duration-500"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(40px)",
          transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 80}ms`,
          background: hovered ? `linear-gradient(145deg, ${col.color}22, ${col.color}11)` : "linear-gradient(145deg, #141414, #0d0d0d)",
          border: hovered ? `1px solid ${col.color}55` : "1px solid rgba(255,255,255,0.06)",
          boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px ${col.color}33` : "0 4px 16px rgba(0,0,0,0.2)",
          transform: (inView ? "" : "translateY(40px) ") + (hovered ? "scale(1.05) translateY(-4px)" : "scale(1) translateY(0)"),
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="text-4xl" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))", transition: "transform 0.3s", transform: hovered ? "scale(1.2) rotateY(15deg)" : "scale(1)" }}>
          {col.icon}
        </div>
        <div className="text-center">
          <p className="font-bold text-sm" style={{ color: "#F0EDE8", fontFamily: "'Cormorant Garamond', serif", fontSize: 16 }}>{col.name}</p>
          <p className="text-xs mt-0.5" style={{ color: "#666" }}>{col.count} styles</p>
        </div>
        <div className="w-8 h-0.5 rounded-full transition-all duration-300" style={{ background: `linear-gradient(90deg, transparent, ${col.color}, transparent)`, transform: hovered ? "scaleX(1.5)" : "scaleX(1)" }} />
        <span className="text-xs font-bold tracking-widest uppercase transition-colors duration-300" style={{ color: hovered ? col.color : "#555" }}>
          Explore →
        </span>
      </div>
    </div>
  );
}

function ReviewCard({ review, index }) {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      className="flex-shrink-0"
      style={{ width: 340, opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(50px)", transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="p-6 rounded-2xl h-full"
        style={{
          background: "linear-gradient(145deg, #141414, #0d0d0d)",
          border: hovered ? "1px solid rgba(200,169,110,0.3)" : "1px solid rgba(255,255,255,0.06)",
          boxShadow: hovered ? "0 24px 48px rgba(0,0,0,0.5)" : "0 4px 16px rgba(0,0,0,0.2)",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="text-4xl mb-4" style={{ color: "rgba(200,169,110,0.3)", fontFamily: "Georgia, serif", lineHeight: 1 }}>"</div>
        <p className="text-sm leading-relaxed mb-5" style={{ color: "#AAA" }}>{review.text}</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "linear-gradient(135deg, #C8A96E, #A07840)", color: "#000" }}>
            {review.avatar}
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "#F0EDE8" }}>{review.name}</p>
            <p className="text-xs" style={{ color: "#666" }}>{review.role}</p>
          </div>
          <div className="ml-auto">
            <StarRating rating={review.rating} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

function HeroSection() {
  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const scrollY = useScrollY();

  useEffect(() => {
    const t = setInterval(() => {
      setAnimating(true);
      setTimeout(() => { setSlide(s => (s + 1) % HERO_SLIDES.length); setAnimating(false); }, 400);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const s = HERO_SLIDES[slide];

  return (
    <section className="relative overflow-hidden" style={{ minHeight: "100vh", background: "#07070a" }}>
      <ParticleField />

      {/* Parallax Image */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.4}px)`,
          zIndex: 2,
        }}
      >
        <img src={s.img} alt="" className="w-full h-full object-cover transition-all duration-700"
          style={{ opacity: animating ? 0 : 0.25, filter: "grayscale(20%) contrast(1.1)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(7,7,10,0.95) 40%, rgba(7,7,10,0.6) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,7,10,1) 0%, transparent 40%)" }} />
      </div>

      {/* Decorative Lines */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute top-0 bottom-0" style={{ left: `${15 + i * 17}%`, width: 1, background: `rgba(200,169,110,${0.03 + i * 0.01})` }} />
        ))}
      </div>

      {/* Content */}
      <div className="relative flex flex-col justify-center px-8 md:px-20" style={{ minHeight: "100vh", zIndex: 4 }}>
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8" style={{ opacity: animating ? 0 : 1, transition: "opacity 0.4s" }}>
            <div className="w-12 h-px" style={{ background: "linear-gradient(90deg, transparent, #C8A96E)" }} />
            <span className="text-xs tracking-[0.4em] uppercase font-bold" style={{ color: "#C8A96E" }}>Luxury Menswear 2025</span>
          </div>

          {/* Main Title */}
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: 1.05, opacity: animating ? 0 : 1, transition: "opacity 0.4s", transform: `translateY(${-scrollY * 0.08}px)` }}>
            <span className="block font-light" style={{ fontSize: "clamp(52px, 7vw, 96px)", color: "#E8E4DC", letterSpacing: "-0.02em" }}>{s.title}</span>
            <span className="block font-bold italic" style={{ fontSize: "clamp(52px, 7vw, 96px)", letterSpacing: "-0.02em", background: "linear-gradient(90deg, #C8A96E, #E8D5A0, #C8A96E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.accent}</span>
          </h1>

          <p className="mt-6 text-base font-light max-w-md leading-relaxed" style={{ color: "#888", opacity: animating ? 0 : 1, transition: "opacity 0.4s 0.1s", letterSpacing: "0.02em" }}>{s.sub}</p>

          {/* CTAs */}
          <div className="flex items-center gap-4 mt-10" style={{ opacity: animating ? 0 : 1, transition: "opacity 0.4s 0.2s" }}>
            <button
              className="group relative overflow-hidden px-8 py-4 font-bold text-sm tracking-widest uppercase rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(90deg, #C8A96E, #A07840)", color: "#000" }}
            >
              <span className="relative z-10">{s.cta}</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(90deg, #E8D5A0, #C8A96E)" }} />
            </button>
            <button className="px-8 py-4 font-bold text-sm tracking-widest uppercase rounded-full transition-all duration-300 hover:scale-105"
              style={{ border: "1px solid rgba(200,169,110,0.4)", color: "#C8A96E" }}>
              Our Story
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-10 mt-16" style={{ opacity: animating ? 0 : 1, transition: "opacity 0.4s 0.3s" }}>
            {[["200+", "Styles"], ["15K+", "Happy Clients"], ["12", "Awards"]].map(([n, l]) => (
              <div key={l}>
                <p className="text-2xl font-bold" style={{ color: "#C8A96E", fontFamily: "Cormorant Garamond, serif" }}>{n}</p>
                <p className="text-xs tracking-widest uppercase mt-0.5" style={{ color: "#555" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-8 md:left-20 flex gap-2" style={{ zIndex: 5 }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className="transition-all duration-300 rounded-full"
              style={{ width: i === slide ? 24 : 6, height: 6, background: i === slide ? "#C8A96E" : "rgba(200,169,110,0.3)" }} />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 right-8 md:right-20 flex flex-col items-center gap-2" style={{ transform: `translateY(${Math.min(scrollY * 0.5, 50)}px)`, opacity: Math.max(1 - scrollY / 200, 0) }}>
          <span className="text-xs tracking-widest uppercase" style={{ color: "#555", writingMode: "vertical-rl" }}>Scroll</span>
          <div className="w-px h-12 overflow-hidden" style={{ background: "rgba(200,169,110,0.2)" }}>
            <div className="w-full h-4 animate-bounce" style={{ background: "linear-gradient(to bottom, #C8A96E, transparent)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function CollectionsSection() {
  const [ref, inView] = useInView();
  const scrollRef = useRef(null);
  const [pos, setPos] = useState(0);
  const scroll = (d) => {
    const el = scrollRef.current;
    if (el) { el.scrollLeft += d * 220; setPos(el.scrollLeft); }
  };
  return (
    <section ref={ref} className="py-24 px-8 md:px-20 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(200,169,110,0.03) 0%, transparent 70%)" }} />
      <div className="flex items-end justify-between mb-12">
        <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
          <p className="text-xs tracking-[0.4em] uppercase font-bold mb-3" style={{ color: "#C8A96E" }}>Our Collections</p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 5vw, 64px)", color: "#F0EDE8", lineHeight: 1, fontWeight: 700 }}>
            Curated for<br /><em>Every Occasion</em>
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ border: "1px solid rgba(200,169,110,0.3)", color: "#C8A96E" }}>←</button>
          <button onClick={() => scroll(1)} className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ border: "1px solid rgba(200,169,110,0.3)", color: "#C8A96E" }}>→</button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4" style={{ scrollBehavior: "smooth", scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {COLLECTIONS.map((c, i) => <CollectionCard key={c.id} col={c} index={i} />)}
      </div>
    </section>
  );
}

function NewArrivalsSection() {
  const [ref, inView] = useInView();
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Suits", "Blazers", "Shirts", "T-Shirts", "Traditional"];
  const filtered = filter === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  return (
    <section ref={ref} className="py-24 px-8 md:px-20 relative" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(200,169,110,0.02) 0%, transparent 40%)" }} />
      <div className="text-center mb-14">
        <p className="text-xs tracking-[0.4em] uppercase font-bold mb-3" style={{ color: "#C8A96E", opacity: inView ? 1 : 0, transition: "opacity 0.6s" }}>Fresh In</p>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 5vw, 64px)", color: "#F0EDE8", lineHeight: 1, fontWeight: 700, opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s 0.1s" }}>
          New Arrivals
        </h2>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap justify-center mb-12" style={{ opacity: inView ? 1 : 0, transition: "opacity 0.7s 0.2s" }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} className="px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-300"
            style={{
              background: filter === c ? "linear-gradient(90deg, #C8A96E, #A07840)" : "transparent",
              border: filter === c ? "none" : "1px solid rgba(200,169,110,0.2)",
              color: filter === c ? "#000" : "#888",
            }}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>

      <div className="text-center mt-14">
        <button className="px-10 py-4 font-bold text-sm tracking-widest uppercase rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
          style={{ border: "1px solid rgba(200,169,110,0.4)", color: "#C8A96E" }}>
          View All Products
        </button>
      </div>
    </section>
  );
}

function TrendingSection() {
  const [ref, inView] = useInView();
  const scrollRef = useRef(null);
  const trends = [
    { label: "Power Dressing", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&q=80", tag: "#PowerSuit" },
    { label: "Smart Casual", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80", tag: "#SmartCasual" },
    { label: "Heritage Look", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80", tag: "#Heritage" },
    { label: "Modern Formal", img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=300&q=80", tag: "#ModernFormal" },
    { label: "Street Luxe", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80", tag: "#StreetLuxe" },
  ];
  return (
    <section ref={ref} className="py-24 relative overflow-hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="px-8 md:px-20 mb-12">
        <p className="text-xs tracking-[0.4em] uppercase font-bold mb-3" style={{ color: "#C8A96E", opacity: inView ? 1 : 0, transition: "opacity 0.6s" }}>What's Hot</p>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 5vw, 64px)", color: "#F0EDE8", lineHeight: 1, fontWeight: 700, opacity: inView ? 1 : 0, transition: "all 0.7s 0.1s" }}>
          Trending Styles
        </h2>
      </div>
      <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 px-8 md:px-20" style={{ scrollbarWidth: "none" }}>
        {trends.map((t, i) => {
          const [h, setH] = useState(false);
          return (
            <div key={i} className="flex-shrink-0 relative overflow-hidden cursor-pointer" style={{ width: 260, height: 380, borderRadius: 20 }}
              onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
              <img src={t.img} alt={t.label} className="w-full h-full object-cover transition-all duration-700"
                style={{ transform: h ? "scale(1.12)" : "scale(1)", filter: h ? "brightness(0.7)" : "brightness(0.55)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-xs font-bold mb-1" style={{ color: "#C8A96E" }}>{t.tag}</p>
                <p className="font-bold text-base" style={{ color: "#F0EDE8", fontFamily: "Cormorant Garamond, serif", fontSize: 20 }}>{t.label}</p>
                <div className="mt-3 transition-all duration-300" style={{ maxHeight: h ? 40 : 0, overflow: "hidden", opacity: h ? 1 : 0 }}>
                  <button className="text-xs font-bold tracking-widest uppercase" style={{ color: "#C8A96E" }}>Shop This Look →</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AboutSection() {
  const [ref, inView] = useInView(0.2);
  return (
    <section ref={ref} className="py-32 px-8 md:px-20 relative overflow-hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(200,169,110,0.05) 0%, transparent 60%)" }} />
      <div className="grid md:grid-cols-2 gap-20 items-center">
        <div>
          <p className="text-xs tracking-[0.4em] uppercase font-bold mb-6" style={{ color: "#C8A96E", opacity: inView ? 1 : 0, transition: "opacity 0.6s" }}>Our Story</p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 5vw, 72px)", color: "#F0EDE8", lineHeight: 1.05, fontWeight: 700, opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s 0.1s" }}>
            Dressed in<br /><em style={{ color: "#C8A96E" }}>Purpose,</em><br />Defined by<br />Excellence
          </h2>
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s 0.3s" }}>
            <p className="mt-8 leading-relaxed" style={{ color: "#888", lineHeight: 1.8 }}>
              Founded in 2012, NOIR was born from a singular conviction: that every man deserves to wear clothes that reflect his true stature. We've spent over a decade perfecting the art of modern menswear, fusing classical tailoring traditions with contemporary vision.
            </p>
            <p className="mt-4 leading-relaxed" style={{ color: "#888", lineHeight: 1.8 }}>
              Each garment is a statement. Each stitch, a commitment. From our ateliers in London and Milan, we craft clothing that doesn't just fit — it transforms.
            </p>
            <div className="flex items-center gap-3 mt-8">
              <div className="w-12 h-px" style={{ background: "linear-gradient(90deg, #C8A96E, transparent)" }} />
              <p className="text-sm italic" style={{ color: "#C8A96E", fontFamily: "Cormorant Garamond, serif", fontSize: 18 }}>— Alessandro Noir, Founder</p>
            </div>
            <button className="mt-8 px-8 py-4 font-bold text-sm tracking-widest uppercase rounded-full transition-all duration-300 hover:scale-105"
              style={{ border: "1px solid rgba(200,169,110,0.4)", color: "#C8A96E" }}>
              Our Heritage
            </button>
          </div>
        </div>

        {/* Visual */}
        <div className="relative" style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(40px)", transition: "all 0.9s 0.2s" }}>
          <div className="relative overflow-hidden rounded-2xl" style={{ height: 500 }}>
            <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80" alt="About" className="w-full h-full object-cover" style={{ filter: "brightness(0.7) grayscale(15%)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(200,169,110,0.1) 0%, transparent 60%)" }} />
          </div>
          {/* Floating Badge */}
          <div className="absolute -bottom-6 -left-6 p-5 rounded-2xl" style={{ background: "linear-gradient(145deg, #141414, #0d0d0d)", border: "1px solid rgba(200,169,110,0.2)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
            <p className="text-3xl font-bold" style={{ color: "#C8A96E", fontFamily: "Cormorant Garamond, serif" }}>12+</p>
            <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "#666" }}>Years of Excellence</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  const [ref, inView] = useInView();
  const scrollRef = useRef(null);
  return (
    <section ref={ref} className="py-24 relative overflow-hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="px-8 md:px-20 mb-12">
        <p className="text-xs tracking-[0.4em] uppercase font-bold mb-3" style={{ color: "#C8A96E", opacity: inView ? 1 : 0, transition: "opacity 0.6s" }}>Testimonials</p>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 5vw, 64px)", color: "#F0EDE8", lineHeight: 1, fontWeight: 700, opacity: inView ? 1 : 0, transition: "all 0.7s 0.1s" }}>
          What Our Clients Say
        </h2>
      </div>
      <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 px-8 md:px-20" style={{ scrollbarWidth: "none" }}>
        {REVIEWS.map((r, i) => <ReviewCard key={r.id} review={r} index={i} />)}
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [ref, inView] = useInView();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section ref={ref} className="py-24 px-8 md:px-20 relative" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div
        className="rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0f0f0f, #141414)",
          border: "1px solid rgba(200,169,110,0.15)",
          opacity: inView ? 1 : 0,
          transform: inView ? "scale(1)" : "scale(0.97)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(200,169,110,0.08) 0%, transparent 60%)" }} />
        <p className="text-xs tracking-[0.4em] uppercase font-bold mb-4 relative" style={{ color: "#C8A96E" }}>Exclusive Access</p>
        <h2 className="relative" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(36px, 5vw, 64px)", color: "#F0EDE8", lineHeight: 1, fontWeight: 700 }}>
          Join the Inner Circle
        </h2>
        <p className="mt-4 max-w-md mx-auto relative" style={{ color: "#777" }}>
          Be first to discover new collections, private sales, and style insights curated for the discerning man.
        </p>
        <div className="flex gap-3 mt-10 max-w-md mx-auto relative justify-center flex-wrap">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 px-5 py-3.5 text-sm outline-none min-w-0"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(200,169,110,0.2)", borderRadius: 50, color: "#F0EDE8", minWidth: 200 }}
          />
          <button
            onClick={() => { if (email) { setSent(true); setEmail(""); } }}
            className="px-7 py-3.5 font-bold text-sm tracking-widest uppercase rounded-full transition-all duration-300 hover:scale-105"
            style={{ background: sent ? "linear-gradient(90deg, #22c55e, #16a34a)" : "linear-gradient(90deg, #C8A96E, #A07840)", color: "#000", whiteSpace: "nowrap" }}
          >
            {sent ? "✓ Subscribed" : "Subscribe"}
          </button>
        </div>
        <p className="mt-4 text-xs relative" style={{ color: "#555" }}>No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-8 md:px-20 py-16 relative" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
        <div className="col-span-2 md:col-span-1">
          <div className="text-2xl font-black tracking-[0.2em] mb-4" style={{ fontFamily: "Cormorant Garamond, serif", color: "#F0EDE8" }}>NOIR</div>
          <p className="text-sm leading-relaxed mb-5" style={{ color: "#666" }}>Luxury menswear for those who command attention and demand excellence.</p>
          <div className="flex gap-3">
            {["IG", "TW", "FB", "YT"].map(s => (
              <button key={s} className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-110"
                style={{ border: "1px solid rgba(200,169,110,0.25)", color: "#C8A96E" }}>{s}</button>
            ))}
          </div>
        </div>

        {[
          { title: "Collections", links: ["Suits", "Blazers", "Shirts", "T-Shirts", "Traditional", "Accessories"] },
          { title: "Company", links: ["Our Story", "Sustainability", "Careers", "Press", "Stockists"] },
          { title: "Support", links: ["Size Guide", "Care Guide", "Shipping", "Returns", "Contact Us"] },
        ].map(col => (
          <div key={col.title}>
            <h4 className="font-bold text-xs tracking-widest uppercase mb-5" style={{ color: "#C8A96E" }}>{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map(l => (
                <li key={l}><a href="#" className="text-sm transition-colors duration-200 hover:text-amber-400" style={{ color: "#666" }}>{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p className="text-xs" style={{ color: "#444" }}>© 2025 NOIR Menswear. All rights reserved.</p>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
            <a key={l} href="#" className="text-xs hover:text-amber-400 transition-colors" style={{ color: "#444" }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function Navbar() {
  const scrollY = useScrollY();
  const [open, setOpen] = useState(false);
  const [cartCount] = useState(2);
  const scrolled = scrollY > 60;
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(7,7,10,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}>
      <div className="px-8 md:px-20 py-4 flex items-center justify-between">
        <div className="text-xl font-black tracking-[0.25em]" style={{ fontFamily: "Cormorant Garamond, serif", color: "#F0EDE8" }}>NOIR</div>
        <div className="hidden md:flex items-center gap-8">
          {["Collections", "New In", "Trending", "About", "Contact"].map(l => (
            <a key={l} href="#" className="text-xs font-bold tracking-widest uppercase transition-colors duration-200 hover:text-amber-400" style={{ color: "#888" }}>{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button className="text-xs font-bold tracking-widest" style={{ color: "#888" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
          <button className="relative text-xs font-bold tracking-widest" style={{ color: "#888" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{ background: "#C8A96E", color: "#000", fontSize: 9 }}>{cartCount}</span>}
          </button>
          <button className="md:hidden" onClick={() => setOpen(!open)} style={{ color: "#888" }}>☰</button>
        </div>
      </div>
      {open && (
        <div className="md:hidden px-8 py-6 flex flex-col gap-4" style={{ background: "rgba(7,7,10,0.98)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {["Collections", "New In", "Trending", "About", "Contact"].map(l => (
            <a key={l} href="#" className="text-sm font-bold tracking-widest uppercase" style={{ color: "#888" }}>{l}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    // Load Google Font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    document.body.style.background = "#07070a";
    document.body.style.color = "#F0EDE8";
    document.body.style.margin = "0";
    document.body.style.overflowX = "hidden";
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div style={{ background: "#07070a", minHeight: "100vh", color: "#F0EDE8", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <Navbar />
      <HeroSection />
      <CollectionsSection />
      <NewArrivalsSection />
      <TrendingSection />
      <AboutSection />
      <ReviewsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
