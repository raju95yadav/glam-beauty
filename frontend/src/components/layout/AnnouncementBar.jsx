import { motion } from 'framer-motion';

const AnnouncementBar = () => {
  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-pink-50 text-pink-400 py-1.5 text-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] border-b border-pink-100"
    >
      <div className="container mx-auto px-4 overflow-hidden whitespace-nowrap">
        <motion.p
          animate={{ x: [20, 0] }}
          className="inline-block"
        >
          Free Shipping on Orders Over ₹299 • 100% Authentic Products • Easy Returns
        </motion.p>
      </div>
    </motion.div>
  );
};

export default AnnouncementBar;
