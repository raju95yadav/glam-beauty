import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { UserCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/send-otp', { email });
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-pink-100 p-8 md:p-12 border border-gray-100"
      >
        <div className="text-center mb-10">
          <div className="size-16 bg-pink-50 rounded-3xl flex items-center justify-center text-pink-600 mx-auto mb-6">
            <UserCircle className="size-10" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-widest mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">Login with your email OTP</p>
        </div>
        
        <form onSubmit={handleSendOTP} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300 placeholder:font-normal"
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
                <Loader2 className="size-4 animate-spin" /> SENDING...
              </span>
            ) : 'Send OTP'}
          </button>
        </form>

        <div className="mt-10 text-center">
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
             By continuing, you agree to our <br/>
             <span className="text-pink-600 underline cursor-pointer">Terms of Service</span> and <span className="text-pink-600 underline cursor-pointer">Privacy Policy</span>
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
