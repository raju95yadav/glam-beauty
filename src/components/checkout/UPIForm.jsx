import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, CheckCircle2, Loader2, Search } from 'lucide-react';

const UPIForm = ({ onValidChange, onVerify, loading }) => {
  const [upiId, setUpiId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = (customId) => {
    const targetId = customId || upiId;
    if (!targetId.includes('@')) return;
    
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      onValidChange(true, { upiId: targetId });
    }, 400);
  };

  const handleAutoFill = () => {
    const testId = 'testuser@upi';
    setUpiId(testId);
    handleVerify(testId);
  };

  const handleChange = (e) => {
    setUpiId(e.target.value);
    setIsVerified(false);
    onValidChange(false, null);
  };

  return (
    <div className="space-y-8 py-4">
      <div className="bg-pink-50/50 p-6 rounded-3xl border border-pink-100 mb-8">
         <div className="flex items-start gap-4 text-pink-600">
            <Smartphone className="size-6 shrink-0" />
            <div>
               <h4 className="font-bold text-sm mb-1">UPI Payment</h4>
               <p className="text-[10px] uppercase font-black tracking-widest opacity-70 leading-relaxed">
                  Enter your UPI ID (e.g. mobile@upi) and verify before proceeding.
               </p>
            </div>
         </div>
      </div>

      <div className="flex justify-between items-center px-1">
         <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">UPI Identification</span>
         <button
           type="button"
           onClick={handleAutoFill}
           className="text-[10px] font-black text-pink-600 uppercase tracking-widest hover:underline bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-100 transition-all"
         >
           ⚡ Auto-fill Test UPI
         </button>
      </div>

      <div className="relative group">
         <input 
           type="text" 
           value={upiId}
           onChange={handleChange}
           placeholder=" "
           className="peer w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-pink-600 outline-none transition-all font-bold text-sm pr-32"
         />
         <label className="absolute left-8 top-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pointer-events-none transition-all peer-focus:top-2 peer-focus:text-pink-600 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-pink-600">
            Your UPI ID
         </label>
         
         <button 
           onClick={handleVerify}
           disabled={!upiId.includes('@') || isVerifying || isVerified}
           className="absolute right-2 top-2 bottom-2 px-6 rounded-2xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-30 disabled:bg-gray-400"
         >
           {isVerifying ? (
             <Loader2 className="size-4 animate-spin" />
           ) : isVerified ? (
             <CheckCircle2 className="size-4" />
           ) : (
             'Verify'
           )}
         </button>
      </div>

      <AnimatePresence>
         {isVerified && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-2xl border border-green-100"
           >
              <CheckCircle2 className="size-5" />
              <span className="text-xs font-bold uppercase tracking-widest">UPI ID Verified: {upiId}</span>
           </motion.div>
         )}
      </AnimatePresence>

      <div className="grid grid-cols-4 gap-4 opacity-40">
         {['GPay', 'PhonePe', 'Paytm', 'Amazon'].map(app => (
           <div key={app} className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase text-gray-400 tracking-tighter">
              {app}
           </div>
         ))}
      </div>
    </div>
  );
};

export default UPIForm;
