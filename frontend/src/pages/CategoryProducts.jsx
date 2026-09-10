import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/product/ProductSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShoppingBag, ArrowLeft } from 'lucide-react';

const CategoryProducts = () => {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const displayName = categoryName
        .split('-')
        .map(word => word === 'and' ? '&' : word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setLoading(true);
            try {
                const data = await productService.getProductsByCategory(categoryName);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching category products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, [categoryName]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="bg-gray-50/50 min-h-screen pb-20">
            {/* Header / Breadcrumbs */}
            <div className="bg-white border-b sticky top-20 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        <Link to="/" className="hover:text-pink-600 transition-colors">Home</Link>
                        <ChevronRight className="size-3" />
                        <span className="text-pink-600">{categoryName}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-12 max-w-7xl">
                {/* Title Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-4">
                            {displayName}<span className="text-pink-600 px-2 italic">Collection</span>
                        </h1>
                        <p className="text-gray-400 text-sm font-medium">
                            Exploring {products.length} premium {displayName} products curated for you
                        </p>
                    </motion.div>
                    
                    <Link 
                        to="/products"
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-pink-600 hover:border-pink-100 transition-all shadow-sm"
                    >
                        <ArrowLeft className="size-4" /> View All Products
                    </Link>
                </div>

                {/* Products Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="skeleton"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
                        </motion.div>
                    ) : products.length > 0 ? (
                        <motion.div 
                            key="grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200"
                        >
                            <div className="size-24 bg-pink-50 rounded-full flex items-center justify-center text-pink-200 mb-8 blur-sm animate-pulse">
                                <ShoppingBag className="size-12" />
                            </div>
                            <div className="relative -mt-20 flex flex-col items-center">
                                <div className="size-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-gray-300 mb-6 border border-gray-50">
                                    <ShoppingBag className="size-10" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-2">No Products Found</h3>
                                <p className="text-gray-400 text-sm mb-10 text-center max-w-xs">
                                    We're currently updating our {categoryName} inventory. Please check back soon!
                                </p>
                                <Link 
                                    to="/products" 
                                    className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-gray-200 hover:scale-105 transition-all"
                                >
                                    Explore Other Categories
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CategoryProducts;
