import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, Sparkles } from 'lucide-react';

const FullscreenLoader = ({ message = "Establishing secure connection..." }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-950/90 backdrop-blur-xl"
    >
      <div className="relative">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            borderColor: ['#ec4899', '#8b5cf6', '#ec4899']
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="size-32 rounded-[2.5rem] border-4 border-pink-500 flex items-center justify-center"
        >
          <ShieldCheck size={48} className="text-white drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
        </motion.div>
        
        <motion.div 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-4 -right-4"
        >
          <Sparkles className="text-pink-400" size={24} />
        </motion.div>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-3">
          Verifying <span className="text-pink-500">Access</span>
        </h3>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
           {message} <Loader2 size={14} className="animate-spin text-pink-500" />
        </p>
      </div>

      <div className="absolute bottom-12 w-full max-w-xs px-8">
         <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
            />
         </div>
         <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.3em] text-center mt-4">
            Security Handshake v4.2
         </p>
      </div>
    </motion.div>
  );
};

export default FullscreenLoader;
