import React, { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Search, 
  Clock, 
  Package, 
  CheckCircle2, 
  Eye,
  ChevronDown,
  DollarSign,
  User as UserIcon,
  Filter,
  Truck,
  Trash2,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Navigation,
  Box,
  XCircle,
  LayoutGrid,
  List,
  RefreshCw,
  X
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  
  const [updatingId, setUpdatingId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/orders');
      setOrders(data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load orders from server');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const { data } = await api.put(`/admin/order/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to "${newStatus}"`);
      
      // Update local state instantly
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus, isDelivered: newStatus === 'Delivered', trackingData: data.trackingData } : o));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus, isDelivered: newStatus === 'Delivered', trackingData: data.trackingData }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Status update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      setIsDeleting(true);
      await api.delete(`/admin/order/${orderToDelete._id}`);
      toast.success('Order permanently removed');
      setOrders(orders.filter(o => o._id !== orderToDelete._id));
      setShowDeleteModal(false);
      if (selectedOrder?._id === orderToDelete._id) {
        setShowDetailModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to delete order');
    } finally {
      setIsDeleting(false);
      setOrderToDelete(null);
    }
  };

  // Metrics calculation
  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
  const pendingCount = orders.filter(o => o.orderStatus === 'Order Placed' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing').length;
  const inTransitCount = orders.filter(o => o.orderStatus === 'Packed' || o.orderStatus === 'Shipped' || o.orderStatus === 'Out for Delivery').length;
  const deliveredCount = orders.filter(o => o.orderStatus === 'Delivered' || o.isDelivered).length;

  // Filtered orders list
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingAddress?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PENDING') return o.orderStatus === 'Order Placed' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing';
    return o.orderStatus?.toLowerCase() === statusFilter.toLowerCase();
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'shipped': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'out for delivery': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'packed': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'processing': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-pink-400 bg-pink-500/10 border-pink-500/30';
    }
  };

  const statusOptions = ['Order Placed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="size-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-nykaa-text-muted uppercase tracking-widest">Loading Order Pipeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Title & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-nykaa-text tracking-tight flex items-center gap-3">
            <Package className="text-pink-500" size={32} />
            Order <span className="text-pink-500">Pipeline</span>
          </h1>
          <p className="text-nykaa-text-muted font-medium mt-1">Real-time order processing pipeline & customer fulfillment hub.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchOrders} 
            className="btn-glass p-3 flex items-center gap-2 text-xs font-bold text-nykaa-text hover:text-pink-500 transition-colors"
            title="Refresh List"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin text-pink-500' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Pipeline Metrics Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex items-center gap-5">
           <div className="size-14 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center shrink-0">
              <ShoppingCart size={26} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-nykaa-text-muted">Total Orders</p>
              <h3 className="text-2xl font-black text-nykaa-text mt-1">{orders.length}</h3>
              <p className="text-[10px] font-bold text-nykaa-text-muted mt-0.5">Recorded in DB</p>
           </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-5">
           <div className="size-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <DollarSign size={26} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-nykaa-text-muted">Total Sales Revenue</p>
              <h3 className="text-2xl font-black text-nykaa-text mt-1">₹{totalRevenue.toLocaleString()}</h3>
              <p className="text-[10px] font-bold text-emerald-400 mt-0.5">Gross Revenue</p>
           </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-5">
           <div className="size-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
              <Clock size={26} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-nykaa-text-muted">Action Required</p>
              <h3 className="text-2xl font-black text-orange-400 mt-1">{pendingCount}</h3>
              <p className="text-[10px] font-bold text-nykaa-text-muted mt-0.5">Pending Processing</p>
           </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-5">
           <div className="size-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <Truck size={26} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-nykaa-text-muted">In Transit / Shipped</p>
              <h3 className="text-2xl font-black text-blue-400 mt-1">{inTransitCount}</h3>
              <p className="text-[10px] font-bold text-nykaa-text-muted mt-0.5">Dispatched to courier</p>
           </div>
        </div>
      </div>

      {/* Filter Tabs & Search Control Bar */}
      <div className="glass-card p-6 space-y-6">
         <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative group w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nykaa-text-muted group-focus-within:text-pink-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search Order ID, Customer, City..."
                className="input-glass pl-12 py-3 bg-nykaa-surface/5 border-nykaa-border text-xs font-bold text-nykaa-text w-full focus:border-pink-500/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-nykaa-surface/5 p-1 rounded-xl border border-nykaa-border">
               <button
                 onClick={() => setViewMode('table')}
                 className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                   viewMode === 'table' ? 'bg-pink-600 text-white shadow-md' : 'text-nykaa-text-muted hover:text-nykaa-text'
                 }`}
               >
                 <List size={16} /> Table View
               </button>
               <button
                 onClick={() => setViewMode('cards')}
                 className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                   viewMode === 'cards' ? 'bg-pink-600 text-white shadow-md' : 'text-nykaa-text-muted hover:text-nykaa-text'
                 }`}
               >
                 <LayoutGrid size={16} /> Cards View
               </button>
            </div>
         </div>

         {/* Pipeline Filter Tabs */}
         <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {[
              { id: 'ALL', label: 'All Orders', count: orders.length },
              { id: 'PENDING', label: 'Pending / Placed', count: pendingCount },
              { id: 'Packed', label: 'Packed', count: orders.filter(o => o.orderStatus === 'Packed').length },
              { id: 'Shipped', label: 'Shipped', count: orders.filter(o => o.orderStatus === 'Shipped').length },
              { id: 'Out for Delivery', label: 'Out for Delivery', count: orders.filter(o => o.orderStatus === 'Out for Delivery').length },
              { id: 'Delivered', label: 'Delivered', count: deliveredCount },
              { id: 'Cancelled', label: 'Cancelled', count: orders.filter(o => o.orderStatus === 'Cancelled').length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                  statusFilter === tab.id
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-500 shadow-md'
                    : 'bg-nykaa-surface/5 border-nykaa-border text-nykaa-text-muted hover:text-nykaa-text hover:border-pink-500/30'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
         </div>
      </div>

      {/* Orders Data View */}
      {viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium text-nykaa-text">
              <thead className="bg-nykaa-surface/10 border-b border-nykaa-border uppercase text-[10px] font-black text-nykaa-text-muted tracking-widest">
                <tr>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Shipping Destination</th>
                  <th className="py-4 px-6">Items & Price</th>
                  <th className="py-4 px-6">Order Date</th>
                  <th className="py-4 px-6">Pipeline Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nykaa-border">
                {filteredOrders.map(order => (
                  <tr key={order._id} className="hover:bg-nykaa-surface/5 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="font-mono font-black text-nykaa-text text-sm">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="font-bold text-nykaa-text flex items-center gap-1.5">
                          <UserIcon size={12} className="text-pink-500" />
                          {order.user?.name || 'Customer'}
                        </p>
                        <p className="text-[10px] text-nykaa-text-muted">{order.user?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="font-bold text-nykaa-text flex items-center gap-1.5">
                          <MapPin size={12} className="text-pink-500" />
                          {order.shippingAddress?.city}, {order.shippingAddress?.state}
                        </p>
                        <p className="text-[10px] text-nykaa-text-muted truncate max-w-[180px]">{order.shippingAddress?.street}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-black text-pink-500 text-sm">₹{order.totalPrice?.toFixed(2)}</p>
                        <p className="text-[10px] font-bold text-nykaa-text-muted">{order.orderItems?.length || 0} Products</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-nykaa-text-muted font-bold text-[11px]">
                      {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order.orderStatus || (order.isDelivered ? 'Delivered' : 'Order Placed'))}`}>
                        {order.orderStatus || (order.isDelivered ? 'Delivered' : 'Order Placed')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}
                        className="btn-primary py-2 px-3 text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md"
                      >
                        <Eye size={14} /> Process
                      </button>
                      <button
                        onClick={() => { setOrderToDelete(order); setShowDeleteModal(true); }}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors inline-block"
                        title="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="py-16 text-center text-nykaa-text-muted space-y-3">
                <ShoppingCart size={40} className="mx-auto text-gray-500" />
                <p className="font-bold text-sm">No orders matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {filteredOrders.map(order => (
             <motion.div
               key={order._id}
               className="glass-card p-6 space-y-6 hover:bg-nykaa-surface/5 transition-all"
             >
                <div className="flex justify-between items-start">
                   <div>
                      <span className="text-[10px] font-black text-nykaa-text-muted uppercase tracking-widest">Order ID</span>
                      <h3 className="text-xl font-black text-nykaa-text font-mono">#{order._id.slice(-8).toUpperCase()}</h3>
                      <p className="text-[10px] text-nykaa-text-muted mt-1 font-bold">
                        Placed: {new Date(order.createdAt).toLocaleString()}
                      </p>
                   </div>
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order.orderStatus || (order.isDelivered ? 'Delivered' : 'Order Placed'))}`}>
                      {order.orderStatus || (order.isDelivered ? 'Delivered' : 'Order Placed')}
                   </span>
                </div>

                {/* Customer Info */}
                <div className="bg-nykaa-surface/5 p-4 rounded-2xl border border-nykaa-border space-y-2">
                   <p className="text-xs font-bold text-nykaa-text flex items-center gap-2">
                      <UserIcon size={14} className="text-pink-500" />
                      {order.user?.name || 'Customer'}
                   </p>
                   <p className="text-[10px] text-nykaa-text-muted flex items-center gap-2">
                      <Mail size={12} /> {order.user?.email || 'N/A'}
                   </p>
                   <p className="text-[10px] text-nykaa-text-muted flex items-center gap-2">
                      <MapPin size={12} className="text-pink-500" /> {order.shippingAddress?.street}, {order.shippingAddress?.city}
                   </p>
                </div>

                {/* Products Thumbnails */}
                <div className="flex items-center justify-between pt-2 border-t border-nykaa-border">
                   <div className="flex items-center gap-2">
                      {order.orderItems?.slice(0, 3).map((item, idx) => (
                        <img key={idx} src={item.image} alt="" className="size-10 rounded-xl object-cover border border-nykaa-border" />
                      ))}
                      {order.orderItems?.length > 3 && (
                        <span className="text-[10px] font-black text-nykaa-text-muted bg-nykaa-surface/10 px-2 py-1 rounded-lg">
                          +{order.orderItems.length - 3}
                        </span>
                      )}
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black uppercase text-nykaa-text-muted">Total Amount</p>
                      <p className="text-lg font-black text-pink-500">₹{order.totalPrice?.toFixed(2)}</p>
                   </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                   <button
                     onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}
                     className="btn-primary w-full py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                   >
                     <Eye size={16} /> Inspect & Process Order
                   </button>
                </div>
             </motion.div>
           ))}
        </div>
      )}

      {/* COMPREHENSIVE ORDER INSPECTION & PROCESSING MODAL */}
      <AnimatePresence>
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowDetailModal(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-md"
             />

             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="glass max-w-3xl w-full p-8 md:p-10 rounded-[2.5rem] relative z-10 border border-nykaa-border shadow-2xl space-y-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
             >
                {/* Modal Header */}
                <div className="flex items-start justify-between pb-6 border-b border-nykaa-border">
                   <div>
                      <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em]">Order Processing Dashboard</span>
                      <h2 className="text-2xl md:text-3xl font-black text-nykaa-text tracking-tight flex items-center gap-3 mt-1 font-mono">
                         #{selectedOrder._id.slice(-8).toUpperCase()}
                      </h2>
                      <p className="text-xs text-nykaa-text-muted font-medium mt-1">
                        Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                      </p>
                   </div>

                   <button 
                     onClick={() => setShowDetailModal(false)}
                     className="p-2.5 rounded-2xl bg-nykaa-surface/10 hover:bg-nykaa-surface/20 text-nykaa-text-muted transition-colors"
                   >
                      <X size={20} />
                   </button>
                </div>

                {/* Status Switcher Pipeline Actions */}
                <div className="space-y-4 bg-nykaa-surface/5 p-6 rounded-3xl border border-nykaa-border">
                   <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase tracking-widest text-nykaa-text flex items-center gap-2">
                         <Truck className="size-4 text-pink-500" /> Change Pipeline Status
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(selectedOrder.orderStatus)}`}>
                         Current: {selectedOrder.orderStatus}
                      </span>
                   </div>

                   <div className="flex flex-wrap gap-2 pt-2">
                      {statusOptions.map(st => {
                        const isActive = selectedOrder.orderStatus === st;
                        return (
                          <button
                            key={st}
                            disabled={updatingId === selectedOrder._id}
                            onClick={() => handleStatusUpdate(selectedOrder._id, st)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
                              isActive
                                ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-pink-500 text-white shadow-lg scale-105'
                                : 'bg-nykaa-surface/10 border-nykaa-border text-nykaa-text-muted hover:border-pink-500/50 hover:text-nykaa-text'
                            }`}
                          >
                            {isActive && <CheckCircle2 size={14} />}
                            {st}
                          </button>
                        );
                      })}
                   </div>
                </div>

                {/* Customer & Shipping Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Customer Profile */}
                   <div className="bg-nykaa-surface/5 p-6 rounded-3xl border border-nykaa-border space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-nykaa-text-muted flex items-center gap-2">
                         <UserIcon size={14} className="text-pink-500" /> Customer Information
                      </h4>
                      <div className="space-y-2 text-xs">
                         <p className="font-bold text-nykaa-text text-sm">{selectedOrder.user?.name || 'Customer'}</p>
                         <p className="text-nykaa-text-muted flex items-center gap-2"><Mail size={14} /> {selectedOrder.user?.email || 'N/A'}</p>
                         <p className="text-nykaa-text-muted flex items-center gap-2"><Phone size={14} /> {selectedOrder.user?.phone || 'N/A'}</p>
                      </div>
                   </div>

                   {/* Shipping Address */}
                   <div className="bg-nykaa-surface/5 p-6 rounded-3xl border border-nykaa-border space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-nykaa-text-muted flex items-center gap-2">
                         <MapPin size={14} className="text-pink-500" /> Delivery Shipping Address
                      </h4>
                      <div className="space-y-1 text-xs text-nykaa-text-muted font-medium">
                         <p className="font-bold text-nykaa-text">{selectedOrder.shippingAddress?.street}</p>
                         <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.zip}</p>
                         <p className="text-pink-500 font-bold uppercase">{selectedOrder.shippingAddress?.country}</p>
                      </div>
                   </div>
                </div>

                {/* Purchased Items List */}
                <div className="space-y-4">
                   <h4 className="text-xs font-black uppercase tracking-widest text-nykaa-text flex items-center gap-2">
                      <Package size={16} className="text-pink-500" /> Purchased Package Items ({selectedOrder.orderItems?.length})
                   </h4>
                   
                   <div className="space-y-3">
                      {selectedOrder.orderItems?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-nykaa-surface/5 rounded-2xl border border-nykaa-border">
                           <div className="flex items-center gap-4">
                              <img src={item.image} alt={item.name} className="size-14 rounded-xl object-cover bg-nykaa-surface border" />
                              <div>
                                 <p className="font-bold text-xs text-nykaa-text">{item.name}</p>
                                 <p className="text-[10px] text-nykaa-text-muted font-bold mt-1">Quantity: {item.qty} × ₹{item.price}</p>
                              </div>
                           </div>
                           <p className="font-black text-sm text-pink-500">₹{(item.qty * item.price).toFixed(2)}</p>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Payment & Total Summary */}
                <div className="bg-nykaa-surface/10 p-6 rounded-3xl border border-nykaa-border flex flex-col sm:flex-row justify-between items-center gap-4">
                   <div className="space-y-1 text-center sm:text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest text-nykaa-text-muted">Payment Method & Status</p>
                      <p className="text-xs font-bold text-nykaa-text uppercase">{selectedOrder.paymentMethod} • <span className={selectedOrder.isPaid ? 'text-emerald-400 font-black' : 'text-amber-400 font-black'}>{selectedOrder.isPaid ? 'PAID' : 'PENDING COD'}</span></p>
                   </div>

                   <div className="text-center sm:text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-nykaa-text-muted">Total Order Amount</p>
                      <p className="text-2xl font-black text-nykaa-text">₹{selectedOrder.totalPrice?.toFixed(2)}</p>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass max-w-sm w-full p-8 rounded-[2.5rem] relative z-10 border border-nykaa-border shadow-2xl text-center space-y-6"
            >
              <div className="size-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto text-red-500">
                <AlertCircle size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-nykaa-text tracking-tight">Delete Order Record?</h3>
                <p className="text-xs text-nykaa-text-muted mt-2 font-medium">
                   Are you sure you want to permanently delete order <span className="font-bold font-mono text-nykaa-text">#{orderToDelete?._id.slice(-8).toUpperCase()}</span>?
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  disabled={isDeleting}
                  onClick={handleDeleteOrder}
                  className="w-full bg-red-500 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm Permanent Delete'}
                </button>
                <button 
                  disabled={isDeleting}
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-3 text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-nykaa-text transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
