import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { authApi } from '../services/authApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminOtpForm = () => {
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
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.sendOTP(email);
      toast.success('OTP sent to admin email!');
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
      
      // Centralized login state synchronization
      login(data.user, data.token);
      
      toast.success('Admin Verified Successfully!');
      
      // Redirect to admin dashboard route
      window.location.href = '/admin-dashboard'; 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form
            key="email-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSendOTP}
            className="space-y-5"
          >
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Authorized Access Only</p>
              <p className="text-[9px] text-indigo-400 mt-1 uppercase tracking-wider font-bold">Admin OTP will be sent to your registered email.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Admin Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {loading ? <Loader2 className="size-5 animate-spin mx-auto" /> : (
                <span className="flex items-center justify-center gap-2">
                  Send OTP <ArrowRight size={16} />
                </span>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="otp-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleVerifyOTP}
            className="space-y-5"
          >
            <div className="text-center mb-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enter 6-Digit OTP</label>
            </div>
            
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                required
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full pl-12 pr-4 py-5 text-center text-2xl tracking-[0.5em] bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-black text-gray-700 placeholder:text-gray-300 placeholder:font-normal"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {loading ? <Loader2 className="size-5 animate-spin mx-auto" /> : 'Verify & Login'}
            </button>

            <div className="text-center">
              <button
                type="button"
                disabled={timer > 0}
                onClick={handleSendOTP}
                className="text-[10px] font-black text-indigo-600 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:underline"
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
              </button>
            </div>
            
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600"
              >
                Change Email
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOtpForm;
