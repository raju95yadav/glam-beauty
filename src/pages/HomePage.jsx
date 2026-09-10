import { useState, useEffect } from 'react';
import BannerSlider from '../components/common/BannerSlider';
import ProductCard from '../components/product/ProductCard';
import productService from '../services/productService';
import Loader from '../components/ui/Loader';
import { ArrowRight, Star, Award, Target, Zap, Sparkles, TrendingUp, Gem, Heart, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data.products || []);
      } catch (err) {
        setError('Failed to load products. Please check your connection.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: 'Makeup', icon: '💄', color: 'bg-rose-50', text: 'text-rose-600', desc: 'Define your beauty' },
    { name: 'Skin Care', icon: '🧴', color: 'bg-teal-50', text: 'text-teal-600', desc: 'Glow from within' },
    { name: 'Hair Care', icon: '💇‍♀️', color: 'bg-amber-50', text: 'text-amber-600', desc: 'Lustrous locks' },
    { name: 'Fragrance', icon: '✨', color: 'bg-purple-50', text: 'text-purple-600', desc: 'Signature scents' },
    { name: 'Personal Care', icon: '🧼', color: 'bg-blue-50', text: 'text-blue-600', desc: 'Daily essentials' },
    { name: 'Luxe', icon: '💎', color: 'bg-gray-50', text: 'text-gray-600', desc: 'Premium luxury' },
  ];

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-[3rem] shadow-soft border border-gray-100">
          <p className="text-red-500 font-bold mb-6 uppercase tracking-widest text-xs">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-100">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-[#FCFBF7] dark:bg-gray-950 transition-colors duration-500">
      <BannerSlider />

      {/* Categories Grid - Elevated */}
      <section className="container mx-auto px-4 md:px-6 py-24">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-50 dark:bg-rose-950/20 text-[10px] font-black uppercase tracking-[0.3em] text-rose-600 mb-4"
          >
            <Sparkles size={12} /> Curated Collections
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white tracking-tighter mb-4">
            Shop by <span className="font-serif italic text-rose-500">Category</span>
          </h2>
          <div className="w-12 h-1 bg-gray-200 dark:bg-gray-800 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link to={`/products?category=${cat.name.toLowerCase().replace(/ /g, '-')}`} className="flex flex-col items-center bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-2xl hover:shadow-rose-100 dark:hover:shadow-none transition-all duration-500 group-hover:-translate-y-2 relative overflow-hidden">
                <div className={`absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity`}>
                   <ArrowRight size={16} className={`${cat.text} -rotate-45`} />
                </div>
                <div className={`size-20 rounded-[2rem] ${cat.color} dark:bg-gray-800 flex items-center justify-center text-4xl mb-6 shadow-inner transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110`}>
                  {cat.icon}
                </div>
                <h3 className="font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest text-[11px] mb-1">
                  {cat.name}
                </h3>
                <p className="text-[9px] text-gray-400 font-medium uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">
                  {cat.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Section - Editorial Feel */}
      <section className="bg-white dark:bg-gray-900 py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-rose-50 dark:bg-rose-950/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white tracking-tighter flex items-center justify-center md:justify-start gap-4 mb-4">
                <TrendingUp size={32} className="text-rose-500" />
                Trending <span className="font-serif italic text-rose-500">Selections</span>
              </h2>
              <p className="text-gray-400 text-sm uppercase tracking-[0.2em] font-medium leading-relaxed">
                Hand-picked luxury favorites that are currently dominating the beauty world.
              </p>
            </div>
            <Link 
              to="/products"
              className="bg-gray-900 dark:bg-rose-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] hover:bg-black transition-all shadow-xl shadow-gray-200 dark:shadow-none flex items-center gap-3 group"
            >
              Discover All <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col gap-6">
                  <div className="animate-pulse bg-gray-100 dark:bg-gray-800 aspect-[4/5] rounded-[2.5rem]"></div>
                  <div className="space-y-3">
                    <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-3 w-3/4 rounded-full"></div>
                    <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-2 w-1/2 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
              {products.slice(0, 5).map((product, idx) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                   <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals - Sophisticated Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white tracking-tighter flex items-center justify-center md:justify-start gap-4 mb-4">
                <Gem size={32} className="text-rose-500" />
                The New <span className="font-serif italic text-rose-500">Edit</span>
              </h2>
              <p className="text-gray-400 text-sm uppercase tracking-[0.2em] font-medium leading-relaxed">
                The latest breakthroughs in cosmetic science and artistic makeup design.
              </p>
            </div>
            <Link 
              to="/products"
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-soft flex items-center gap-3 group"
            >
              Browse Shop <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col gap-6">
                  <div className="animate-pulse bg-gray-100 dark:bg-gray-800 aspect-[4/5] rounded-[2.5rem]"></div>
                  <div className="space-y-3">
                    <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-3 w-3/4 rounded-full"></div>
                    <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-2 w-1/2 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
              {products.slice(5, 10).map((product, idx) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                   <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Luxury Promo Banner - Editorial Style */}
      <section className="container mx-auto px-4 md:px-6 py-16">
         <div className="bg-gray-900 dark:bg-gray-900 rounded-[4rem] min-h-[500px] flex flex-col lg:flex-row items-center justify-between gap-12 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-20 w-full lg:w-1/2 p-12 md:p-20 flex flex-col items-center lg:items-start text-center lg:text-left">
               <motion.span 
                 initial={{ opacity: 0, y: 10 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 className="px-5 py-2 rounded-full bg-rose-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-lg shadow-rose-500/20"
               >
                 Season Discovery
               </motion.span>
               <h2 className="text-5xl md:text-7xl font-light mb-8 leading-[1.1] tracking-tighter">
                 The Signature <br /><span className="font-serif italic text-rose-400">GlAM Beauty</span>
               </h2>
               <p className="text-lg opacity-70 mb-12 max-w-md font-medium leading-relaxed">
                 Experience the intersection of luxury and science. Unlock your most radiant skin with our boutique serum collections.
               </p>
               <Link to="/products" className="bg-white text-gray-900 font-black px-12 py-5 rounded-[2rem] uppercase tracking-[0.25em] text-[10px] hover:bg-rose-600 hover:text-white transition-all shadow-2xl flex items-center gap-4 group">
                 Redeem Offer <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform opacity-30 group-hover:opacity-100" />
               </Link>
            </div>
            
            <motion.div 
              style={{ perspective: 1000 }}
              className="relative z-10 w-full lg:w-1/2 h-full min-h-[400px]"
            >
               <motion.img 
                 initial={{ rotateY: 20, opacity: 0, scale: 1.1 }}
                 whileInView={{ rotateY: 0, opacity: 1, scale: 1 }}
                 transition={{ duration: 1.5 }}
                 src="https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=600&h=800" 
                 alt="Promo Display" 
                 className="absolute inset-0 w-full h-full object-cover lg:rounded-l-[4rem]"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent lg:hidden" />
               <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-900 to-transparent lg:hidden" />
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/4 size-96 bg-rose-500/10 rounded-full blur-[120px] -translate-y-1/2" />
            <div className="absolute -bottom-20 -right-20 size-80 bg-rose-900/20 rounded-full blur-[100px]" />
         </div>
      </section>

      {/* Trust Context Badges */}
      <section className="container mx-auto px-4 md:px-6 py-24 border-t border-gray-100 dark:border-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {[
            { icon: ShieldCheck, title: 'Boutique Security', desc: 'Encrypted and secure checkout always.' },
            { icon: Award, title: 'Curated Quality', desc: 'Direct sourcing from premium global brands.' },
            { icon: Zap, title: 'Elite Support', desc: 'Dedicated beauty concierge at your disposal.' },
            { icon: Heart, title: 'Happy Clientele', desc: 'Join millions of satisfied luxury enthusiasts.' },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-8 group"
            >
              <div className="shrink-0 size-16 rounded-[1.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-soft flex items-center justify-center text-rose-500 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6">
                <item.icon size={28} />
              </div>
              <div>
                <h4 className="font-black text-gray-900 dark:text-gray-100 text-[11px] mb-2 uppercase tracking-[0.2em]">{item.title}</h4>
                <p className="text-gray-400 dark:text-gray-500 text-[11px] font-medium leading-relaxed tracking-tight">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
