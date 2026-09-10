import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-6 group hover:border-pink-200 transition-colors"
    >
      <div className="size-24 md:size-32 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 group-hover:scale-105 transition-transform duration-500">
        <img src={item.images?.[0]?.url || item.images?.[0] || 'https://via.placeholder.com/200'} alt={item.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-grow flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start mb-1">
            <p className="text-[10px] font-black text-pink-600 uppercase tracking-[0.2em]">{item.brand?.name || 'Nykaa Brand'}</p>
            <button 
              onClick={() => onRemove(item._id)}
              className="text-gray-300 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 className="size-5" />
            </button>
          </div>
          <Link to={`/product/${item._id}`} className="text-sm md:text-base font-bold text-gray-800 hover:text-pink-600 transition-colors line-clamp-1">
            {item.name}
          </Link>
          <div className="flex items-center gap-2 mt-2">
             <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-400 font-bold uppercase tracking-widest">In Stock</span>
          </div>
        </div>

        <div className="flex justify-between items-end mt-4">
          <div className="flex items-center bg-gray-50 rounded-xl p-1 border">
            <button 
              onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
              className="size-8 flex items-center justify-center hover:text-pink-600 transition-colors"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-10 text-center text-sm font-black text-gray-800">{item.quantity}</span>
            <button 
              onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
              className="size-8 flex items-center justify-center hover:text-pink-600 transition-colors"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <div className="text-right">
             <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Subtotal</p>
             <p className="text-lg font-black text-gray-900">₹{item.price * item.quantity}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
