import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

const RegisterPage = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await signup(data);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Create Account</h1>
            <p className="text-gray-500">Join the beauty community today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  {...register('name', { required: 'Name is required' })}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition-all`}
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              </div>
              {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                  })}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition-all`}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' }
                  })}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition-all`}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              </div>
              {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  {...register('confirmPassword', { 
                    required: 'Please confirm password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition-all`}
                />
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.confirmPassword.message}</p>}
            </div>

            <button 
              disabled={loading}
              className="w-full bg-pink-600 text-white font-bold py-3 mt-4 rounded-xl hover:bg-pink-700 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? 'Creating Account...' : 'Continue'}
              {!loading && <ArrowRight className="size-5" />}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400 px-6">
            By creating an account, you agree to our 
            <span className="text-gray-600 font-medium"> Terms of Service </span> and 
            <span className="text-gray-600 font-medium"> Privacy Policy </span>.
          </p>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? {' '}
            <Link to="/login" className="text-pink-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
