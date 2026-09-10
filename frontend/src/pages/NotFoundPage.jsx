import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-9xl font-black text-pink-100 mb-4 select-none">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ooops! Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          The page you are looking for might have been removed, had its name changed or is temporarily unavailable.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 bg-pink-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-pink-700 transition-all uppercase tracking-widest shadow-lg shadow-pink-100"
          >
            <Home className="size-5" />
            Back to Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-all uppercase tracking-widest"
          >
            <ArrowLeft className="size-5" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
