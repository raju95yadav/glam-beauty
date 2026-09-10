import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToggleTabs from '../components/ToggleTabs';
import UserOtpForm from '../components/UserOtpForm';
import AdminLoginForm from '../components/AdminLoginForm';
import { ShoppingBag, Sparkles, ShieldCheck, Moon, Sun, ArrowLeft } from 'lucide-react';
import influencerImg from '../assets/beauty_influencer_login.png';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('user');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FDFCF0] dark:bg-gray-950 transition-colors duration-700 font-sans selection:bg-pink-100 dark:selection:bg-pink-900 overflow-hidden">
      {/* Theme Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-8 right-8 z-50 p-3 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-full border border-white/20 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:scale-110 active:scale-95 transition-all shadow-soft"
      >
        {isDarkMode ? <Sun size={20} className="fill-yellow-400 text-yellow-500" /> : <Moon size={20} className="fill-indigo-600 text-indigo-700" />}
      </button>

      {/* Left Section: Influencer Branding (Desktop) */}
      <div className="hidden md:flex flex-1 relative group overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={influencerImg} 
          alt="Beauty Influencer" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-[#B76E79]/10 mix-blend-overlay" />
        
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-end p-20 text-white">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              <Sparkles size={12} className="text-yellow-400" /> Curated Beauty Boutique
            </div>
            <h1 className="text-7xl font-light mb-4 tracking-tight leading-none">
              GLAM <span className="font-serif italic text-rose-300">Portal</span>
            </h1>
            <p className="text-lg font-medium text-white/70 max-w-sm mx-auto leading-relaxed mb-10">
              Where luxury meets accessibility. Discover your signature glow with our curated collections.
            </p>
            
            <div className="flex gap-8 justify-center items-center opacity-60">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Premium</span>
              <div className="size-1 rounded-full bg-white/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Authentic</span>
              <div className="size-1 rounded-full bg-white/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Exclusive</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section: Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        {/* Subtle Background Mesh */}
        <div className="absolute inset-0 bg-mesh-pearl dark:bg-gray-950 opacity-50" />
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-sm sm:max-w-md relative z-10"
        >
          {/* Mobile Header */}
          <div className="md:hidden text-center mb-12">
            <h2 className="text-4xl font-light text-gray-900 dark:text-white uppercase tracking-tighter mb-2">
              Nykaa <span className="font-serif italic text-pink-600">Glam</span>
            </h2>
          </div>

          <div className="mb-10 text-center md:text-left">
            <motion.div
              layout
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-5xl font-light text-gray-900 dark:text-white tracking-tighter mb-3 transition-colors">
                {activeTab === 'user' ? 'Welcome' : 'Admin'} <span className="font-serif italic text-rose-500">{activeTab === 'user' ? 'Back' : 'Portal'}</span>
              </h2>
              <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                {activeTab === 'user' ? 'Access your luxury beauty profile' : 'Secure administrative gateway'}
              </p>
            </motion.div>
          </div>

          <div className="bg-white/50 dark:bg-gray-900/30 backdrop-blur-md rounded-[2.5rem] p-2 border border-white dark:border-gray-800 shadow-soft">
            <ToggleTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="px-6 pb-8">
              <AnimatePresence mode="wait">
                {activeTab === 'user' ? (
                  <motion.div
                    key="user-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <UserOtpForm />
                  </motion.div>
                ) : (
                  <motion.div
                    key="admin-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <AdminLoginForm />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <footer className="mt-12 text-center">
            <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.25em]">
              <ShieldCheck size={14} className="text-rose-500/50" /> Encrypted & Secure Auth Portal
            </div>
            <div className="mt-6 flex justify-center gap-6">
               <button className="text-[10px] font-black text-gray-300 dark:text-gray-700 hover:text-rose-500 transition-colors uppercase tracking-widest">Help</button>
               <button className="text-[10px] font-black text-gray-300 dark:text-gray-700 hover:text-rose-500 transition-colors uppercase tracking-widest">Privacy</button>
               <button className="text-[10px] font-black text-gray-300 dark:text-gray-700 hover:text-rose-500 transition-colors uppercase tracking-widest">Terms</button>
            </div>
          </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
