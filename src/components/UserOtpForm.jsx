import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldCheck, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { authApi } from '../services/authApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';

const UserOtpForm = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await authApi.sendOTP(email);
      toast.success('OTP sent to your email!');
      setStep(2);
      setTimer(60); // 1 minute cooldown
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.verifyOTP(email, otp);
      
      const role = data.role || data.user?.role || 'user';
      login(data.user, data.token);
      
      toast.success('Welcome to the Boutique!');
      
      if (role === 'admin') {
        const adminBaseUrl = import.meta.env.VITE_ADMIN_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5174' : 'https://beauty-admin-five.vercel.app');
        window.location.href = `${adminBaseUrl}/dashboard?token=${data.token}&role=${role}`;
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      toast.error('Google Sign-In failed: No credential received');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.googleLogin(credentialResponse.credential);
      const role = data.role || data.user?.role || 'user';
      login(data.user, data.token);

      toast.success('Welcome to the Boutique!');

      if (role === 'admin') {
        const adminBaseUrl = import.meta.env.VITE_ADMIN_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5174' : 'https://beauty-admin-five.vercel.app');
        window.location.href = `${adminBaseUrl}/dashboard?token=${data.token}&role=${role}`;
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Sign-In failed: Please ensure http://localhost:5173 is added to Authorized JavaScript Origins in Google Cloud Console.');
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form
            key="email-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSendOTP}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">Email Destination</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg group-focus-within/input:bg-rose-50 dark:group-focus-within/input:bg-rose-950/30 transition-colors">
                  <Mail className="size-4 text-gray-400 group-focus-within/input:text-rose-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-gray-50/30 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-rose-200 dark:focus:border-rose-900 outline-none transition-all font-medium text-gray-700 dark:text-gray-200 placeholder:text-gray-300 dark:placeholder:text-gray-600 shadow-sm text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full py-4 bg-rose-600 text-white font-bold text-[11px] uppercase tracking-[0.25em] rounded-2xl shadow-rose-100 dark:shadow-none hover:bg-rose-700 active:scale-[0.98] sm:active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 bg-shimmer relative overflow-hidden"
            >
              {loading ? <Loader2 className="size-5 animate-spin mx-auto text-white/50" /> : (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  Request OTP <ArrowRight size={14} className="opacity-50 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              )}
            </button>
            
            <p className="text-center text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-widest leading-relaxed">
              We'll send a one-time password to verify your identity.
            </p>
          </motion.form>
        ) : (
          <motion.form
            key="otp-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleVerifyOTP}
            className="space-y-4"
          >
            <div className="text-center mb-1">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-center">Verification Code</label>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1">Sent to <span className="text-gray-600 dark:text-gray-300 font-bold">{email}</span></p>
            </div>
            
            <div className="relative group/input">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg group-focus-within/input:bg-rose-50 dark:group-focus-within/input:bg-rose-950/30 transition-colors">
                 <ShieldCheck className="size-4 text-gray-400 group-focus-within/input:text-rose-500 transition-colors" />
              </div>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full pl-14 pr-4 py-4 text-center text-3xl tracking-[0.5em] bg-gray-50/30 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-rose-200 dark:focus:border-rose-900 outline-none transition-all font-light text-gray-700 dark:text-gray-200 placeholder:text-gray-200 dark:placeholder:text-gray-800 shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full py-4 bg-gray-900 dark:bg-rose-600 text-white font-bold text-[11px] uppercase tracking-[0.25em] rounded-2xl shadow-xl hover:bg-black dark:hover:bg-rose-700 active:scale-[0.98] sm:active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {loading ? <Loader2 className="size-5 animate-spin mx-auto text-white/50" /> : 'Authorize Access'}
            </button>

            <div className="flex flex-col gap-3 items-center pt-1">
              <button
                type="button"
                disabled={timer > 0 || loading}
                onClick={handleSendOTP}
                className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-[0.2em] disabled:opacity-30 disabled:cursor-not-allowed hover:underline transition-all"
              >
                {timer > 0 ? `Resend available in ${timer}s` : 'Resend Verification Code'}
              </button>
              
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[9px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.15em] hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1"
              >
                <Sparkles size={10} /> Correction: Change Email
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Divider and Google Sign-In */}
      <div className="pt-2 space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-800 absolute"></div>
          <span className="relative bg-white/80 dark:bg-gray-900/80 px-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest backdrop-blur-sm">
            ── OR ──
          </span>
        </div>

        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            shape="pill"
            theme="outline"
          />
        </div>
      </div>
    </div>
  );
};

export default UserOtpForm;
