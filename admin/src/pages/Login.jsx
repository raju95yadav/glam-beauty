import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Eye,
  EyeOff,
  Sun,
  Moon,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Authenticating administrator...');
    try {
      const { data } = await api.post('/auth/admin-login', { email, password });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      toast.success(`Welcome back, ${data.user?.name || 'Admin'}!`, { id: loadingToast });
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Invalid administrator credentials.', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@gmail.com');
    toast.success('Admin email pre-filled! Enter your admin password.', {
      icon: '✨',
      duration: 2500
    });
  };

  return (
    <div 
      className="min-h-screen relative overflow-x-hidden flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-no-repeat transition-colors duration-500"
      style={{ backgroundImage: "url('/admin_login_background.png')" }}
    >
      {/* Adaptive Theme Backdrop Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-pink-50/60 to-white/80 dark:from-slate-950/85 dark:via-[#0b0f19]/80 dark:to-purple-950/85 backdrop-blur-[8px] transition-colors duration-500 pointer-events-none" />

      {/* Ambient Animated Light Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.25, 1],
            x: [0, 60, 0],
            y: [0, 40, 0],
            opacity: [0.35, 0.55, 0.35]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-20 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-pink-500/25 dark:bg-pink-600/20 blur-[100px] sm:blur-[140px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -60, 0],
            y: [0, -50, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-28 -right-20 w-80 sm:w-[550px] h-80 sm:h-[550px] bg-purple-500/25 dark:bg-purple-600/25 blur-[100px] sm:blur-[140px] rounded-full"
        />
      </div>

      {/* Top Header Controls Bar */}
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between pt-2 pb-4">
        {/* Brand identity chip */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-sm"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold tracking-tight text-slate-800 dark:text-slate-200">
            GLAM BEAUTY <span className="text-pink-500 text-[10px] uppercase font-black px-1.5 py-0.5 rounded-md bg-pink-500/10 border border-pink-500/20">PORTAL</span>
          </span>
        </motion.div>

        {/* Theme Toggle & External Store Link */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/50 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all shadow-sm"
            title="Open customer storefront"
          >
            <span>Live Store</span>
            <ExternalLink size={13} />
          </a>

          {/* Theme switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Light/Dark theme"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/60 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 hover:text-pink-500 transition-all shadow-sm active:scale-95"
          >
            {darkMode ? (
              <>
                <Sun size={15} className="text-amber-400 animate-spin-slow" />
                <span className="text-xs font-medium hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={15} className="text-purple-600" />
                <span className="text-xs font-medium hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>
        </motion.div>
      </header>

      {/* Main Login Card Section */}
      <main className="relative z-10 w-full max-w-md my-auto py-4">
        {/* Animated Brand Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center size-16 sm:size-20 bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 rounded-3xl mb-4 shadow-xl shadow-pink-500/30 text-white relative group cursor-pointer"
          >
            <ShieldCheck size={36} className="sm:size-10 relative z-10 drop-shadow-md" />
            <Sparkles size={16} className="absolute top-2 right-2 text-pink-200 animate-pulse" />
            <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
            ADMIN <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">ACCESS</span>
          </h1>
          <p className="mt-1.5 text-xs sm:text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.25em]">
            Authorized Credentials Required
          </p>
        </motion.div>

        {/* Glassmorphic Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full bg-white/85 dark:bg-slate-900/80 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] border border-white/80 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(244,63,94,0.18),0_0_1px_1px_rgba(0,0,0,0.05)] dark:shadow-[0_25px_65px_-12px_rgba(0,0,0,0.7)] transition-all duration-300"
        >
          {/* Security Banner Pill */}
          <div className="mb-6 px-4 py-3 rounded-2xl bg-pink-500/10 dark:bg-pink-500/15 border border-pink-500/20 dark:border-pink-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-pink-500 text-white shadow-sm shadow-pink-500/40">
                <KeyRound size={14} />
              </div>
              <div>
                <p className="text-xs font-bold text-pink-900 dark:text-pink-200 leading-tight">
                  Secure Admin Zone
                </p>
                <p className="text-[10px] text-pink-700/80 dark:text-pink-300/80 font-medium">
                  256-Bit Encrypted Session
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[10px] font-bold text-pink-600 dark:text-pink-300 hover:text-pink-700 dark:hover:text-pink-200 underline decoration-pink-500/40 hover:decoration-pink-500 transition-colors shrink-0"
              title="Click to pre-fill admin email"
            >
              Demo Fill
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label 
                htmlFor="admin-email"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider px-1"
              >
                Admin Email
              </label>
              <div className="relative group/input">
                <Mail 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-pink-500 transition-colors pointer-events-none" 
                  size={19} 
                />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 focus:border-pink-500 dark:focus:border-pink-500 focus:ring-4 focus:ring-pink-500/15 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-semibold tracking-tight shadow-sm outline-none transition-all"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label 
                  htmlFor="admin-password"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                >
                  Password
                </label>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Required
                </span>
              </div>
              <div className="relative group/input">
                <Lock 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-pink-500 transition-colors pointer-events-none" 
                  size={19} 
                />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 focus:border-pink-500 dark:focus:border-pink-500 focus:ring-4 focus:ring-pink-500/15 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-semibold tracking-tight shadow-sm outline-none transition-all"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.015 }}
              whileTap={{ scale: loading ? 1 : 0.985 }}
              className="w-full mt-2 py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 active:shadow-md transition-all flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {/* Button Shimmer Effect */}
              <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="size-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-xs uppercase tracking-[0.2em]">Verifying...</span>
                </div>
              ) : (
                <>
                  <span className="text-xs uppercase tracking-[0.2em]">Secure Administrator Login</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </main>

      {/* Footer Security Badge */}
      <footer className="relative z-10 w-full max-w-md text-center py-2">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.25em] flex items-center justify-center gap-2"
        >
          <ShieldCheck size={14} className="text-pink-500 shrink-0" />
          <span>Protected by Glam Security Protocol v4.2</span>
        </motion.p>
      </footer>
    </div>
  );
};

export default Login;


