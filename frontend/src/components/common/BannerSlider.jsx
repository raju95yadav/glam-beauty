import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import heroFragrance from '/src/assets/hero_fragrance.png';
import heroMakeup from '/src/assets/hero_makeup.png';
import heroSkincare from '/src/assets/hero_skincare.png';

const banners = [
  {
    id: 1,
    image: heroFragrance,
    badge: 'Limited Edition',
    title: 'Essence of',
    titleAccent: 'Elegance',
    subtitle: 'Discover our curated summer fragrance collection featuring global names.',
    cta: 'Explore Scent',
    color: 'from-rose-500/20'
  },
  {
    id: 2,
    image: heroMakeup,
    badge: 'New Arrival',
    title: 'The Art of',
    titleAccent: 'Glow',
    subtitle: 'Professional-grade makeup palettes designed for the modern spotlight.',
    cta: 'Shop Makeup',
    color: 'from-pink-500/20'
  },
  {
    id: 3,
    image: heroSkincare,
    badge: 'Boutique Exclusive',
    title: 'Pure Skin',
    titleAccent: 'Rituals',
    subtitle: 'Transform your routine with organic serums used by the world’s top influencers.',
    cta: 'View Rituals',
    color: 'from-teal-500/20'
  }
];

const BannerSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full aspect-[21/9] md:aspect-[21/8] lg:aspect-[21/7] overflow-hidden bg-gray-50 dark:bg-gray-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Hero Image with Ken Burns effect */}
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "linear" }}
            className="absolute inset-0"
          >
            <img
              src={banners[current].image}
              alt={banners[current].title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Overlays */}
          <div className={`absolute inset-0 bg-gradient-to-r ${banners[current].color} to-transparent`} />
          <div className="absolute inset-0 bg-black/10" />

          <div className="absolute inset-0 flex items-center px-6 md:px-24">
            <div className="max-w-2xl text-white">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.25em] mb-6"
              >
                <Sparkles size={12} className="text-yellow-400" /> {banners[current].badge}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-4xl md:text-7xl font-light mb-4 tracking-tight leading-none drop-shadow-xl"
              >
                {banners[current].title} <br />
                <span className="font-serif italic text-rose-400">{banners[current].titleAccent}</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-sm md:text-lg opacity-90 max-w-md leading-relaxed mb-10 font-medium"
              >
                {banners[current].subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="flex gap-4"
              >
                <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-rose-600 hover:text-white transition-all flex items-center gap-3 active:scale-95 group">
                  {banners[current].cta} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modern Navigation */}
      <div className="absolute bottom-8 right-8 md:right-24 flex items-center gap-6 z-20">
        <div className="flex gap-3">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="relative p-2"
            >
              <span className={`block size-1.5 rounded-full transition-all duration-500 ${current === i ? 'bg-rose-500 scale-150' : 'bg-white/30 hover:bg-white/60'
                }`} />
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="size-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="size-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Decorative vertical marquee side-bar (Desktop) */}
      <div className="hidden lg:block absolute right-12 top-0 bottom-0 w-px bg-white/10 z-10" />
    </div>
  );
};

export default BannerSlider;
