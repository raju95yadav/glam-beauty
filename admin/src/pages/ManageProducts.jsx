import React, { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit2, 
  Trash2, 
  Search, 
  Filter, 
  Package, 
  AlertCircle, 
  X, 
  Plus,
  Layers,
  Tag,
  DollarSign,
  Box,
  Image as ImageIcon,
  MoreVertical,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('ALL'); // 'ALL' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'IN_STOCK'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products?limit=200');
      setProducts(data.products || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product removed from inventory');
      setProducts(products.filter(p => p._id !== id));
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.message || 'Deletion failed. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Updating product...');
    try {
      const formData = new FormData();
      formData.append('name', selectedProduct.name);
      formData.append('price', selectedProduct.price);
      formData.append('category', selectedProduct.category);
      formData.append('description', selectedProduct.description);
      formData.append('stock', selectedProduct.stock || 0);
      formData.append('brand', selectedProduct.brand || '');
      
      if (selectedProduct.newImage) {
        formData.append('images', selectedProduct.newImage);
      }

      await api.put(`/products/${selectedProduct._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Product updated successfully', { id: loadingToast });
      fetchProducts();
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Update failed', { id: loadingToast });
    }
  };

  // Compute inventory alert counts
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const inStockCount = products.filter(p => p.stock > 5).length;

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (stockFilter === 'LOW_STOCK') return p.stock > 0 && p.stock <= 5;
    if (stockFilter === 'OUT_OF_STOCK') return p.stock === 0;
    if (stockFilter === 'IN_STOCK') return p.stock > 5;
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-nykaa-text tracking-tight">Manage <span className="text-pink-500">Inventory</span></h1>
          <p className="text-nykaa-text-muted font-medium mt-1">Found {products.length} products in your beauty collection.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nykaa-text-muted group-focus-within:text-pink-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, category, brand..."
              className="input-glass pl-12 bg-nykaa-surface/5 border-nykaa-border focus:bg-nykaa-surface/10 transition-all text-sm font-bold text-nykaa-text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => navigate('/add-product')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Item
          </button>
        </div>
      </div>

      {/* Stock Filter Tabs Bar */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
         <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
            {[
              { id: 'ALL', label: 'All Products', count: products.length },
              { id: 'LOW_STOCK', label: 'Low Stock Alerts (<=5)', count: lowStockCount, isWarning: true },
              { id: 'OUT_OF_STOCK', label: 'Out of Stock (0)', count: outOfStockCount, isDanger: true },
              { id: 'IN_STOCK', label: 'Healthy Stock (>5)', count: inStockCount },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStockFilter(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border flex items-center gap-2 ${
                  stockFilter === tab.id
                    ? tab.isDanger 
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : tab.isWarning
                        ? 'bg-amber-500 text-white border-amber-400 shadow-md'
                        : 'bg-pink-600 text-white border-pink-500 shadow-md'
                    : 'bg-nykaa-surface/5 border-nykaa-border text-nykaa-text-muted hover:text-nykaa-text'
                }`}
              >
                {tab.isDanger && <AlertCircle size={14} className="text-red-300" />}
                {tab.isWarning && <AlertTriangle size={14} className="text-amber-300" />}
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  stockFilter === tab.id ? 'bg-white/20 text-white' : 'bg-nykaa-surface/10 text-nykaa-text-muted'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
         </div>

         <button 
           onClick={fetchProducts}
           className="btn-glass p-2.5 text-nykaa-text hover:text-pink-500 transition-colors flex items-center gap-2 text-xs font-bold"
           title="Sync Inventory"
         >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
         </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="glass-card animate-pulse h-80 bg-white/5 rounded-3xl"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-20 flex flex-col items-center justify-center text-center max-w-2xl mx-auto"
        >
          <div className="size-24 bg-pink-500/10 rounded-full flex items-center justify-center mb-6">
            <Package className="text-pink-500" size={48} />
          </div>
          <h3 className="text-2xl font-black text-nykaa-text">No items match your filter</h3>
          <p className="text-nykaa-text-muted font-medium mt-2 max-w-sm">We couldn't find any products matching your current stock filter or search term.</p>
          <button 
             onClick={() => { setSearchTerm(''); setStockFilter('ALL'); }}
             className="mt-8 text-pink-500 font-black uppercase tracking-widest text-xs hover:underline"
          >
            Clear Filters
          </button>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((p) => {
            const isOutOfStock = p.stock === 0;
            const isLowStock = p.stock > 0 && p.stock <= 5;

            return (
              <motion.div 
                variants={itemVariants}
                key={p._id} 
                className={`glass-card flex flex-col group relative ${
                  isOutOfStock ? 'border-red-500/40 bg-red-500/5' : isLowStock ? 'border-amber-500/40 bg-amber-500/5' : ''
                }`}
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                  <img 
                    src={p.images?.[0]?.url || 'https://placehold.co/400x500?text=No+Image'} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                     <div className="flex gap-2">
                       <button 
                          onClick={() => { setSelectedProduct(p); setIsEditing(true); }}
                          className="flex-1 bg-white text-black py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all active:scale-95 shadow-lg"
                       >
                         Edit & Restock
                       </button>
                       <button 
                          onClick={() => { setSelectedProduct(p); setShowDeleteModal(true); }}
                          className="size-11 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors active:scale-95 shadow-lg"
                       >
                         <Trash2 size={18} />
                       </button>
                     </div>
                  </div>

                  {/* Top Category Badge */}
                  <div className="absolute top-3 left-3">
                     <span className="glass px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest backdrop-blur-md">
                       {p.category}
                     </span>
                  </div>

                  {/* Stock Status Badge */}
                  <div className="absolute top-3 right-3">
                     {isOutOfStock ? (
                       <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 animate-pulse">
                         <AlertCircle size={10} /> Out of Stock
                       </span>
                     ) : isLowStock ? (
                       <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 animate-bounce">
                         <AlertTriangle size={10} /> {p.stock} Left (Low)
                       </span>
                     ) : (
                       <span className="bg-emerald-500/90 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                         {p.stock} in stock
                       </span>
                     )}
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-black text-nykaa-text leading-tight flex-1 pr-3 line-clamp-1">{p.name}</h3>
                    <p className="text-lg font-black text-pink-500">₹{p.price}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-nykaa-text-muted mt-auto pt-4 border-t border-nykaa-border">
                     <div className="flex items-center gap-1.5">
                        <Box size={14} className={isOutOfStock ? 'text-red-500' : isLowStock ? 'text-amber-500' : 'text-emerald-500'} />
                        <span className={isOutOfStock ? 'text-red-400 font-black' : isLowStock ? 'text-amber-400 font-black' : 'text-nykaa-text'}>
                          {p.stock} units left
                        </span>
                     </div>
                     <span className="text-[10px] font-black text-nykaa-text-muted uppercase tracking-widest bg-nykaa-surface/10 px-2 py-0.5 rounded-lg">
                        {p.brand || 'Nykaa'}
                     </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-nykaa-bg/80 dark:bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass max-w-sm w-full p-10 rounded-[2.5rem] relative z-10 border border-nykaa-border shadow-2xl text-center"
            >
              <div className="size-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <AlertCircle className="text-red-500" size={40} />
              </div>
              <h3 className="text-3xl font-black text-nykaa-text mb-3 tracking-tighter">Wait a moment</h3>
              <p className="text-nykaa-text-muted font-medium mb-10 leading-relaxed italic">
                 You are about to permanently remove <span className="text-nykaa-text font-black not-italic">"{selectedProduct?.name}"</span>. This action is irreversible.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleDelete(selectedProduct._id)}
                  className="w-full bg-red-500 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white hover:bg-red-600 transition-all active:scale-95 shadow-xl shadow-red-500/20"
                >
                  Confirm Delete
                </button>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 text-gray-500 font-black text-xs uppercase tracking-[0.2em] hover:text-white transition-colors"
                >
                  Keep Product
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit & Restock Product Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-nykaa-bg/80 dark:bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="glass max-w-4xl w-full p-8 md:p-12 rounded-[3.5rem] relative z-10 border border-nykaa-border shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                   <div className="size-14 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500">
                      <Edit2 size={24} />
                   </div>
                   <div>
                      <h3 className="text-3xl font-black text-nykaa-text tracking-tighter">Edit & <span className="text-pink-500">Restock</span> Product</h3>
                      <p className="text-nykaa-text-muted text-xs font-bold uppercase tracking-widest mt-1">Update Inventory Stock & Details</p>
                   </div>
                </div>
                <button 
                   onClick={() => setIsEditing(false)} 
                   className="size-12 rounded-2xl glass flex items-center justify-center text-nykaa-text-muted hover:text-nykaa-text hover:bg-nykaa-surface/10 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Core Info */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-nykaa-text-muted uppercase tracking-widest px-1">Product Name</label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-nykaa-text-muted" size={18} />
                        <input 
                          className="input-glass pl-12 font-bold text-nykaa-text"
                          placeholder="Ex: Matte Silk Lipstick"
                          value={selectedProduct.name}
                          onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-nykaa-text-muted uppercase tracking-widest px-1">Category</label>
                        <div className="relative">
                          <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-nykaa-text-muted" size={18} />
                          <input 
                            className="input-glass pl-12 font-bold text-nykaa-text"
                            placeholder="Ex: Makeup"
                            value={selectedProduct.category}
                            onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-nykaa-text-muted uppercase tracking-widest px-1">Price (₹)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-nykaa-text-muted" size={18} />
                          <input 
                            type="number"
                            className="input-glass pl-12 font-bold text-pink-500"
                            placeholder="0.00"
                            value={selectedProduct.price}
                            onChange={(e) => setSelectedProduct({...selectedProduct, price: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-amber-400 uppercase tracking-widest px-1 flex items-center gap-1">
                           <Box size={12} /> Restock Inventory
                         </label>
                         <div className="relative">
                           <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
                           <input 
                             type="number"
                             min="0"
                             className="input-glass pl-12 font-black text-lg text-amber-400 border-amber-500/40 focus:border-amber-500"
                             placeholder="Ex: 50"
                             value={selectedProduct.stock}
                             onChange={(e) => setSelectedProduct({...selectedProduct, stock: Number(e.target.value)})}
                           />
                         </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-nykaa-text-muted uppercase tracking-widest px-1">Brand</label>
                        <div className="relative">
                           <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-nykaa-text-muted" size={18} />
                           <input 
                             className="input-glass pl-12 font-bold text-nykaa-text"
                             placeholder="Ex: Nykaa"
                             value={selectedProduct.brand || ''}
                             onChange={(e) => setSelectedProduct({...selectedProduct, brand: e.target.value})}
                           />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Imagery & Description */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-nykaa-text-muted uppercase tracking-widest px-1">Product Description</label>
                       <textarea 
                         rows="4"
                         className="input-glass resize-none min-h-[120px] font-medium text-sm text-nykaa-text"
                         placeholder="Describe the beauty and benefits..."
                         value={selectedProduct.description}
                         onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-nykaa-text-muted uppercase tracking-widest px-1">Main Imagery</label>
                       <div className="relative group/img overflow-hidden rounded-3xl aspect-video glass flex items-center justify-center cursor-pointer border-dashed border-2 border-nykaa-border hover:border-pink-500/50 transition-all">
                          {selectedProduct.newImage ? (
                             <img src={URL.createObjectURL(selectedProduct.newImage)} className="w-full h-full object-cover" />
                          ) : (
                             <img src={selectedProduct.images?.[0]?.url || 'https://placehold.co/400x500?text=No+Image'} className="w-full h-full object-cover opacity-60 group-hover/img:scale-105 transition-transform duration-700" />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                             <ImageIcon size={32} className="mb-2" />
                             <p className="text-[10px] font-black uppercase tracking-widest">Change Image</p>
                          </div>
                          <input 
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setSelectedProduct({...selectedProduct, newImage: e.target.files[0]})}
                          />
                       </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-nykaa-border flex gap-4">
                   <button 
                     type="button"
                     onClick={() => setIsEditing(false)}
                     className="flex-1 py-5 rounded-2xl glass font-black text-xs uppercase tracking-[0.2em] text-nykaa-text-muted hover:text-nykaa-text hover:bg-nykaa-surface/10 transition-all"
                   >
                     Discard Changes
                   </button>
                   <button 
                     type="submit" 
                     className="flex-[2] btn-primary py-5 rounded-2xl flex items-center justify-center gap-3"
                   >
                     <span className="text-xs uppercase tracking-[0.2em]">Update Inventory & Stock</span>
                     <ChevronRight size={18} />
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProducts;
