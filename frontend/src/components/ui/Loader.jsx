import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'size-6',
    md: 'size-12',
    lg: 'size-20',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          rotate: { repeat: Infinity, duration: 1, ease: 'linear' },
          scale: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
        }}
        className={`${sizeClasses[size]} border-4 border-pink-100 border-t-pink-600 rounded-full`}
      />
      {fullScreen && (
        <p className="text-pink-600 font-bold uppercase tracking-widest text-xs animate-pulse">
          Loading Nykaa Clone...
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
