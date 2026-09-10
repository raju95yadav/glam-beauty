import React from 'react';
import { motion } from 'framer-motion';
import { Banknote, ShieldCheck } from 'lucide-react';

const CODOption = ({ onValidChange }) => {
  // Use effect to signal that COD is always valid when selected
  React.useEffect(() => {
    onValidChange(true, { method: 'cod' });
  }, []);

  return (
    <div className="space-y-8 py-6">
       <motion.div 
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 text-center space-y-6"
       >
          <div className="size-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-pink-600">
             <Banknote className="size-10" />
          </div>
          <div className="space-y-2">
             <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Cash on Delivery</h3>
             <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                Pay with cash when your order is delivered to your doorstep.
             </p>
          </div>
          
          <div className="flex items-center gap-3 justify-center text-[10px] font-black uppercase tracking-[0.2em] text-pink-600 bg-pink-50/50 py-3 rounded-2xl border border-pink-100">
             <ShieldCheck className="size-4" />
             Safe & Secure
          </div>
       </motion.div>

       <div className="px-6 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Important Note:</p>
          <ul className="space-y-2">
             {[
               'Please keep the exact amount ready',
               'Change might not be available with delivery partner',
               'Digital payment on delivery may be available'
             ].map((note, i) => (
               <li key={i} className="flex gap-3 text-[11px] text-gray-500 font-medium">
                  <span className="text-pink-600 mt-1">•</span>
                  {note}
               </li>
             ))}
          </ul>
       </div>
    </div>
  );
};

export default CODOption;
