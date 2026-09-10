import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Droplets, 
  Wind, 
  Flower2, 
  Bath, 
  Baby, 
  HeartPulse, 
  User, 
  Diamond 
} from 'lucide-react';

const categories = [
  { name: 'Makeup', icon: Sparkles },
  { name: 'Skin Care', icon: Droplets },
  { name: 'Hair Care', icon: Wind },
  { name: 'Fragrance', icon: Flower2 },
  { name: 'Personal Care', icon: Bath },
  { name: 'Mom & Baby', icon: Baby },
  { name: 'Health & Wellness', icon: HeartPulse },
  { name: 'Men', icon: User },
  { name: 'Luxe', icon: Diamond }
];

const containerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: { opacity: 1, y: 0 }
};

const CategoryMenu = () => {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm"
    >
      <div className="max-w-[1240px] mx-auto px-4">
        <ul className="flex items-center justify-between h-12 overflow-x-auto no-scrollbar gap-6 md:gap-8">
          {categories.map((category) => (
            <motion.li 
              key={category.name} 
              variants={itemVariants}
              className="group relative flex-shrink-0"
            >
              <Link
                to={`/category/${category.name.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-')}`}
                className="flex items-center gap-2 text-[11px] md:text-[12px] font-bold text-gray-700 hover:text-rose-600 transition-colors duration-200 uppercase tracking-widest py-3 block whitespace-nowrap"
              >
                <category.icon className="size-3.5 md:size-4 text-gray-400 group-hover:text-rose-600 transition-colors" strokeWidth={2.5} />
                {category.name}
              </Link>
              <motion.div 
                className="absolute bottom-1 left-0 h-[2.5px] bg-rose-600 rounded-full"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.2 }}
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default CategoryMenu;

