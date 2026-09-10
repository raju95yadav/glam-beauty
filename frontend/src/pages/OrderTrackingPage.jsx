import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ChevronLeft,
  Navigation,
  ShieldCheck,
  Search,
  Star,
  Activity,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  Box,
  FileText,
  HelpCircle
} from 'lucide-react';
import orderService from '../services/orderService';
import Loader from '../components/ui/Loader';
import { toast } from 'react-hot-toast';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchTracking = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderTracking(id);
      setTrackingData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tracking:', err);
      setError(err.response?.data?.message || 'Order tracking not found or access denied');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, [id]);

  const handleCopyTrackingNumber = () => {
    if (trackingData?.trackingNumber) {
      navigator.clipboard.writeText(trackingData.trackingNumber);
      setCopied(true);
      toast.success('Tracking code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <Loader fullScreen />;

  if (error || !trackingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-sm">
           <div className="size-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto text-red-500 shadow-sm border border-red-100">
              <Search className="size-10" />
           </div>
           <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Order Not Found</h2>
           <p className="text-gray-500 text-xs font-medium leading-relaxed">{error || "We couldn't track that order ID. Please verify the link or try again."}</p>
           <div className="space-y-3">
             <button onClick={fetchTracking} className="w-full bg-pink-600 text-white font-black py-3.5 rounded-2xl uppercase tracking-widest text-[10px] hover:bg-pink-700 transition-all flex items-center justify-center gap-2">
               <RefreshCw className="size-3.5 animate-spin" /> Retry Fetch
             </button>
             <Link to="/orders" className="block w-full bg-gray-900 text-white font-black py-3.5 rounded-2xl uppercase tracking-widest text-[10px] hover:bg-black transition-all">Go to My Orders</Link>
           </div>
        </div>
      </div>
    );
  }

  const {
    orderId,
    orderStatus,
    isCancelled,
    cancelledAt,
    stages = [],
    activeIndex = 0,
    progressPercentage = 0,
    trackingNumber,
    courierPartner,
    dispatchCity,
    destinationCity,
    estimatedDelivery,
    statusLogs = [],
    shippingAddress,
    orderItems = [],
    totalPrice,
    isPaid,
    paymentMethod
  } = trackingData;

  const stageIcons = {
    'Order Placed': ShieldCheck,
    'Processing': Clock,
    'Packed': Box,
    'Shipped': Truck,
    'Out for Delivery': Navigation,
    'Delivered': CheckCircle2
  };

  return (
    <div className="bg-gradient-to-b from-pink-50/40 via-gray-50/60 to-white min-h-screen pb-24 border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-5xl py-8 md:py-12 space-y-8">
        
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="space-y-1">
              <Link to="/orders" className="flex items-center gap-2 text-pink-600 font-black text-[10px] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                 <ChevronLeft className="size-4" />
                 Back to Order History
              </Link>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter italic">
                Track Order <span className="text-pink-600">.</span>
              </h1>
           </div>
           
           <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white px-5 py-2.5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3">
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Order Ref</p>
                    <p className="text-xs font-black text-gray-900 font-mono">#{orderId.substring(orderId.length - 8).toUpperCase()}</p>
                 </div>
              </div>

              <div className="bg-white px-5 py-2.5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3">
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Tracking Code</p>
                    <p className="text-xs font-black text-pink-600 font-mono">{trackingNumber}</p>
                 </div>
                 <button 
                   onClick={handleCopyTrackingNumber}
                   className="p-1.5 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors"
                   title="Copy Tracking Number"
                 >
                   {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
                 </button>
              </div>
           </div>
        </div>

        {/* Cancellation Alert Banner if order is cancelled */}
        {isCancelled ? (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500 text-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-red-200 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
          >
             <div className="flex items-center gap-5">
                <div className="size-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                   <AlertTriangle className="size-8 text-white" />
                </div>
                <div className="space-y-1">
                   <span className="px-3 py-1 bg-white/20 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Order Status</span>
                   <h2 className="text-2xl font-black uppercase tracking-tighter">This Order Has Been Cancelled</h2>
                   <p className="text-xs text-red-100 font-medium">
                     Cancelled on {cancelledAt ? new Date(cancelledAt).toLocaleString() : 'Recent'}. Stock has been restored and any pending payments are refunded.
                   </p>
                </div>
             </div>
             <Link 
               to="/products"
               className="bg-white text-red-600 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all shrink-0 shadow-lg"
             >
               Re-Order Items
             </Link>
          </motion.div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tracking Timeline */}
          <div className="lg:col-span-2 space-y-8">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-xl shadow-pink-100/20 space-y-12"
             >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100">
                   <div className="space-y-1.5">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-600 flex items-center gap-2">
                        <Clock className="size-3.5" /> Estimated Delivery Arrival
                      </p>
                      <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">
                        {new Date(estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                      </h2>
                   </div>
                   
                   <div className="flex items-center gap-3 bg-pink-50/80 px-4 py-2.5 rounded-2xl border border-pink-100">
                      <div className="size-3 rounded-full bg-emerald-500 animate-ping"></div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Current Status</p>
                        <p className="text-xs font-black text-pink-600 uppercase tracking-wider">{orderStatus}</p>
                      </div>
                   </div>
                </div>

                {/* Multi-Step Visual Progress Bar */}
                <div className="relative pt-6 pb-8">
                   {/* Background Track Line */}
                   <div className="absolute top-11 left-6 right-6 h-2 bg-gray-100 rounded-full overflow-hidden z-0">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: isCancelled ? '0%' : `${progressPercentage}%` }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="h-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 shadow-lg shadow-pink-500/50"
                      />
                   </div>

                   {/* Timeline Step Nodes */}
                   <div className="grid grid-cols-6 relative z-10 text-center">
                      {stages.map((stage, idx) => {
                        const Icon = stageIcons[stage.key] || Package;
                        const isCompleted = !isCancelled && idx <= activeIndex;
                        const isCurrent = !isCancelled && idx === activeIndex;

                        return (
                          <div key={idx} className="flex flex-col items-center group relative">
                             {/* Floating Current Badge */}
                             <AnimatePresence>
                                {isCurrent && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute -top-10 bg-gray-900 text-white text-[8px] font-black px-2.5 py-1 rounded-lg whitespace-nowrap uppercase tracking-widest shadow-md z-20"
                                  >
                                     Active Stage
                                  </motion.div>
                                )}
                             </AnimatePresence>

                             <motion.div 
                               initial={{ scale: 0.8 }}
                               animate={{ scale: isCurrent ? 1.15 : 1 }}
                               className={`size-11 sm:size-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                                 isCancelled
                                  ? 'bg-gray-100 text-gray-400 border border-gray-200'
                                  : isCompleted 
                                    ? 'bg-gradient-to-tr from-pink-600 to-purple-600 text-white shadow-pink-200' 
                                    : 'bg-white text-gray-300 border-2 border-gray-200'
                               } ${isCurrent ? 'ring-4 ring-pink-100 shadow-xl' : ''}`}
                             >
                                <Icon className={`size-5 ${isCurrent ? 'animate-bounce text-white' : ''}`} />
                             </motion.div>

                             <div className="mt-3 space-y-0.5">
                                <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-tighter leading-tight ${
                                  isCompleted ? 'text-gray-900 font-extrabold' : 'text-gray-400'
                                }`}>
                                   {stage.label}
                                </p>
                                {stage.date && (
                                  <p className="text-[8px] font-bold text-gray-400 hidden sm:block">
                                    {new Date(stage.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </p>
                                )}
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>

                {/* Route & Courier Card */}
                <div className="bg-gradient-to-br from-gray-50 to-pink-50/30 rounded-[2.5rem] p-6 md:p-8 border border-gray-100 space-y-6">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex items-center gap-4 flex-1 w-full">
                         <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 text-pink-600 font-black text-xs flex items-center gap-2">
                            <MapPin className="size-4" />
                            <span>{dispatchCity}</span>
                         </div>
                         <div className="h-0.5 flex-1 bg-pink-300/50 bg-dashed relative min-w-[50px]">
                            <Navigation className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 size-4 text-pink-600 rotate-90 animate-pulse" />
                         </div>
                         <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 text-pink-600 font-black text-xs flex items-center gap-2">
                            <MapPin className="size-4" />
                            <span>{destinationCity}</span>
                         </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm w-full md:w-auto">
                         <Truck className="size-5 text-pink-600 shrink-0" />
                         <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Partner</p>
                            <p className="text-xs font-black text-gray-900">{courierPartner}</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Real-time Status History Logs Tree */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-2">
                         <Activity className="size-4 text-pink-600" />
                         Real-Time Tracking History
                      </h3>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                         {statusLogs.length} Events Recorded
                      </span>
                   </div>

                   <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-pink-200">
                      {statusLogs.map((log, idx) => (
                         <motion.div 
                           key={idx}
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: idx * 0.05 }}
                           className="relative group"
                         >
                            <div className="absolute -left-6 top-1.5 size-3.5 rounded-full bg-pink-600 ring-4 ring-pink-100 group-first:bg-gradient-to-r group-first:from-pink-600 group-first:to-purple-600"></div>
                            <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 hover:border-pink-200 transition-colors">
                               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide">{log.title || log.status}</h4>
                                  <span className="text-[10px] font-bold text-pink-600 font-mono">
                                     {new Date(log.timestamp).toLocaleString()}
                                  </span>
                               </div>
                               <p className="text-xs text-gray-600 font-medium mb-2">{log.description}</p>
                               {log.location && (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-gray-400 bg-white px-2.5 py-1 rounded-lg border border-gray-100">
                                     <MapPin className="size-3 text-pink-500" /> {log.location}
                                  </span>
                               )}
                            </div>
                         </motion.div>
                      ))}
                   </div>
                </div>
             </motion.div>

             {/* Package Items Card */}
             <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 space-y-6 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                   <Package className="size-4 text-pink-500" /> Items In This Shipment ({orderItems.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {orderItems.map((item, idx) => (
                     <div key={idx} className="flex gap-4 p-4 border border-gray-100 rounded-2xl group hover:border-pink-200 transition-all bg-gray-50/50">
                        <img src={item.image} alt={item.name} className="size-16 rounded-xl object-cover bg-white border border-gray-100 shrink-0" />
                        <div className="min-w-0 flex-1">
                           <p className="text-xs font-black uppercase tracking-tight text-gray-900 truncate">{item.name}</p>
                           <p className="text-[10px] font-bold text-pink-600 mt-1 uppercase">Qty: {item.qty} × ₹{item.price}</p>
                           <span className="inline-block mt-2 text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Quality Checked</span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Right Sidebar Info */}
          <aside className="space-y-8">
             <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-pink-100/20 space-y-8">
                {/* Destination Details */}
                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-3">Delivery Destination</h3>
                   <div className="space-y-2">
                      <p className="text-xs font-black text-gray-900 uppercase italic">Shipping Address</p>
                      <p className="text-xs font-medium text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                         {shippingAddress?.street},<br />
                         {shippingAddress?.city}, {shippingAddress?.state} - {shippingAddress?.zip}<br />
                         {shippingAddress?.country}
                      </p>
                   </div>
                </div>

                {/* Payment Summary */}
                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-3">Payment Summary</h3>
                   <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                         <span className="font-bold text-gray-500">Method</span>
                         <span className="font-black text-gray-900 uppercase">{paymentMethod}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                         <span className="font-bold text-gray-500">Payment Status</span>
                         <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {isPaid ? 'Paid' : 'Pending COD'}
                         </span>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-200/60">
                         <span className="font-black text-gray-900">Total Charged</span>
                         <span className="font-black text-pink-600 text-sm">₹{totalPrice}</span>
                      </div>
                   </div>
                </div>

                {/* Customer Support */}
                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-3">Order Support</h3>
                   <div className="space-y-2.5">
                      <Link to="/contact" className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-pink-50 text-gray-800 hover:text-pink-600 text-xs font-black uppercase tracking-wider transition-all border border-gray-100">
                         <span className="flex items-center gap-2"><HelpCircle className="size-4 text-pink-500" /> Need Help?</span>
                         <ChevronLeft className="size-4 rotate-180 text-gray-400" />
                      </Link>
                   </div>
                </div>
             </div>

             {/* Promo Card */}
             <div className="bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 p-8 rounded-[3rem] text-white space-y-5 relative overflow-hidden shadow-xl group">
                <div className="relative z-10 space-y-3">
                   <Star className="size-7 fill-white/20" />
                   <h4 className="text-xl font-black uppercase tracking-tighter italic leading-tight">Glam Beauty Promise</h4>
                   <p className="text-[11px] font-medium opacity-90 leading-relaxed">
                      Every order is 100% authentic, climate-controlled, and quality checked before dispatch.
                   </p>
                </div>
                <div className="absolute -bottom-10 -right-10 size-36 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
