import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, PartyPopper } from 'lucide-react';

const SuccessModal = ({ show, loading, orderId }) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[3rem] p-12 max-w-sm w-full text-center relative z-10 shadow-2xl"
          >
            {loading ? (
              <div className="space-y-8 py-12">
                 <div className="relative size-24 mx-auto">
                    <Loader2 className="size-24 text-pink-600 animate-spin opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="size-16 bg-pink-600 rounded-full animate-pulse"></div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Processing</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Securely completing your order...</p>
                 </div>
              </div>
            ) : (
              <div className="space-y-8">
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                   className="size-24 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white shadow-xl shadow-green-200"
                 >
                    <CheckCircle2 className="size-12" />
                 </motion.div>
                 
                 <div className="space-y-3">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Order Placed!</h2>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                       Thank you for your purchase. Your beauty journey continues with us!
                    </p>
                 </div>

                 <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Order Reference</p>
                     <p className="text-xs font-bold text-gray-900 font-mono">{orderId ? `#${orderId.toString().slice(-8).toUpperCase()}` : 'Processing...'}</p>
                     <p className="text-[8px] text-orange-500 font-bold uppercase tracking-widest mt-1">⚠️ Test Mode</p>
                 </div>

                 <div className="pt-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-pink-600">
                    <PartyPopper className="size-4" />
                    Preparing your package
                 </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
