import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import { authApi } from '../services/authApi';
import toast from 'react-hot-toast';
import FullscreenLoader from './FullscreenLoader';
import { useAuth } from '../hooks/useAuth';

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading || isRedirecting) return;
    
    setLoading(true);
    const loadingToast = toast.loading('Establishing secure administrative session...');
    
    try {
      const { data } = await authApi.adminLogin(email, password);
      const role = data.role || data.user?.role || 'admin';
      const adminBaseUrl = import.meta.env.VITE_ADMIN_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5174' : 'https://beauty-admin-pied.vercel.app');
      
      // Professional delay for UX
      setTimeout(() => {
        setLoading(false);
        setIsRedirecting(true);
        
        // Centralized login state synchronization
        login(data.user, data.token);
        
        toast.success('Access Granted. Welcome, Admin.', { id: loadingToast });
        
        // Final fade-out and redirect
        setTimeout(() => {
           window.location.href = `${adminBaseUrl}/dashboard?token=${data.token}&role=${role}`;
        }, 2200);
      }, 1500);

    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Unauthorized: Invalid Credentials', { id: loadingToast });
    }
  };

  return (
    <>
      <AnimatePresence>
        {isRedirecting && <FullscreenLoader message="Initializing secure management console..." />}
      </AnimatePresence>

      <motion.form
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onSubmit={handleLogin}
        className={loading || isRedirecting ? "space-y-6 opacity-40 pointer-events-none grayscale blur-md transition-all duration-1000" : "space-y-6 transition-all duration-500"}
      >
        <div className="bg-gray-900/5 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] shadow-soft">
          <div className="flex items-center gap-4">
             <div className="size-10 bg-gray-900 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-white shadow-soft">
                <ShieldCheck size={20} className="text-rose-400" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-[0.2em]">Authorized Access</p>
               <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-widest font-medium italic">Administrative Gateway</p>
             </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">Identity</label>
          <div className="relative group/input">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg group-focus-within/input:bg-gray-900 dark:group-focus-within/input:bg-white transition-all duration-300">
              <Mail className="size-4 text-gray-400 group-focus-within/input:text-white dark:group-focus-within/input:text-gray-900 transition-colors" />
            </div>
            <input
              type="email"
              required
              placeholder="admin@boutique.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-14 pr-4 py-5 bg-gray-50/30 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-gray-900 dark:focus:border-white outline-none transition-all font-medium text-gray-700 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-700 shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">Credential</label>
          <div className="relative group/input">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg group-focus-within/input:bg-gray-900 dark:group-focus-within/input:bg-white transition-all duration-300">
              <Key className="size-4 text-gray-400 group-focus-within/input:text-white dark:group-focus-within/input:text-gray-900 transition-colors" />
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-14 pr-4 py-5 bg-gray-50/30 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-gray-900 dark:focus:border-white outline-none transition-all font-medium text-gray-700 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-700 shadow-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || isRedirecting}
          className="w-full py-5 bg-gray-900 text-white font-bold text-[11px] uppercase tracking-[0.25em] rounded-2xl shadow-xl hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="opacity-70">Verifying Identity...</span>
            </>
          ) : (
            <>
              Secure Authorize <ArrowRight size={16} className="opacity-40" />
          </>
        )}
      </button>
      <p className="text-center text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-widest leading-relaxed">
        Access to this portal is restricted and monitored.
      </p>
    </motion.form>
    </>
  );
};

export default AdminLoginForm;
