import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authApi } from '../services/authApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login(formData.email, formData.password);
      
      // Centralized login state synchronization
      login(data.user, data.token);
      
      toast.success('Login Successful!');
      
      if (data.user.role === 'admin') {
        window.location.href = '/admin-dashboard';
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-300 group-focus-within:text-pink-600 transition-colors" />
          <input
            type="email"
            required
            placeholder="example@mail.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300 placeholder:font-normal"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Password</label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-300 group-focus-within:text-pink-600 transition-colors" />
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300 placeholder:font-normal"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-pink-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4.5 bg-pink-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-pink-200 hover:bg-pink-700 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
      >
        {loading ? <Loader2 className="size-5 animate-spin mx-auto" /> : 'Sign In'}
      </button>

      <div className="text-center pt-2">
        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
          Don't have an account? <span className="text-pink-600 cursor-pointer hover:underline" onClick={() => navigate('/register')}>Sign Up</span>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
