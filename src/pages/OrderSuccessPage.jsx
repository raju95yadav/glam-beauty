import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight, CheckCircle2, Truck, Star } from 'lucide-react';

const OrderSuccessPage = () => {
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get('orderId') || 'N/A';

  // Calculate estimated delivery date (5 business days from now)
  const getEstimatedDelivery = () => {
    const date = new Date();
    let daysAdded = 0;
    while (daysAdded < 5) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0 && date.getDay() !== 6) daysAdded++;
    }
    return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-[3.5rem] p-12 md:p-16 border border-gray-100 shadow-2xl shadow-gray-200/50 text-center relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -ml-32 -mb-32 opacity-50"></div>

        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
          className="size-28 bg-pink-600 rounded-full mx-auto flex items-center justify-center text-white shadow-2xl shadow-pink-200 mb-10"
        >
          <CheckCircle2 className="size-14" />
        </motion.div>

        <div className="space-y-4 mb-12">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic">Order Confirmed!</h1>
          <p className="text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
            Your beauty haul is officially locked in. We're already picking the best pieces for you!
          </p>
        </div>

        <div className="bg-gray-50 rounded-[2rem] p-8 mb-12 border border-gray-100 relative z-10">
           <div className="grid grid-cols-2 gap-8">
              <div className="text-left space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Reference</p>
                 <p className="text-sm font-black text-gray-900 font-mono">#{orderId}</p>
              </div>
              <div className="text-right space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estimated Arrival</p>
                 <p className="text-sm font-black text-pink-600">{getEstimatedDelivery()}</p>
              </div>
           </div>
        </div>

        <div className="space-y-4 mb-12">
           <div className="flex items-center justify-center gap-4 text-gray-400">
              <div className="size-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm">
                 <Truck className="size-5" />
              </div>
              <div className="h-px w-8 bg-gray-100"></div>
              <div className="size-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm text-pink-600">
                 <Star className="size-5" />
              </div>
              <div className="h-px w-8 bg-gray-100"></div>
              <div className="size-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm">
                 <ShoppingBag className="size-5" />
              </div>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Track your package in the orders section</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
           <Link 
             to={`/orders/${orderId}`}
             className="flex-1 bg-gray-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-black transition-all uppercase tracking-widest"
           >
              Track Order
              <ChevronRight className="size-4" />
           </Link>
           <Link 
             to="/products" 
             className="flex-1 bg-white text-gray-900 font-black py-5 rounded-2xl border-2 border-gray-100 flex items-center justify-center gap-3 hover:border-pink-200 hover:text-pink-600 transition-all uppercase tracking-widest"
           >
              Keep Shopping
           </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
