import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Mail, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const email = location.state?.email;

  if (!email) {
    navigate('/login');
    return null;
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      const { user, token } = response.data;
      
      const role = user.role || response.data.role || 'user';
      login(user, token);
      
      if (role === 'admin') {
        const adminBaseUrl = import.meta.env.VITE_ADMIN_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5174' : 'https://beauty-admin-five.vercel.app');
        toast.success('Admin login successful! Redirecting to dashboard...');
        setTimeout(() => {
          window.location.href = `${adminBaseUrl}/dashboard?token=${token}&role=${role}`;
        }, 1500);
      } else {
        navigate('/login-success');
      }
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-pink-100 p-8 md:p-12 border border-gray-100"
      >
        <div className="text-center mb-10">
          <div className="size-16 bg-pink-50 rounded-3xl flex items-center justify-center text-pink-600 mx-auto mb-6">
            <Mail className="size-10" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-widest mb-2">Verify OTP</h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
            Sent to <span className="text-pink-600">{email}</span>
          </p>
        </div>
        
        <form onSubmit={handleVerifyOTP} className="space-y-8">
          <div>
            <label htmlFor="otp" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center px-1">Enter 6-digit Security Code</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000 000"
              maxLength="6"
              required
              className="w-full px-6 py-6 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all font-black text-3xl text-center text-gray-800 tracking-[0.5em] placeholder:text-gray-200"
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest p-4 rounded-xl text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-pink-200 hover:bg-pink-700 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" /> VERIFYING...
              </span>
            ) : 'Verify & Login'}
          </button>
        </form>
        
        <div className="mt-8 text-center flex flex-col gap-4">
           <button 
             onClick={() => navigate('/login')}
             className="text-[10px] font-black text-pink-600 uppercase tracking-widest hover:underline"
           >
             Change Email Address
           </button>
           <div className="h-px bg-gray-100 flex-grow"></div>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
             Didn't receive code? <span className="text-pink-600 cursor-pointer">Resend OTP</span>
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerificationPage;
