import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';
import Loader from '../components/ui/Loader';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle, Navigation, ShieldCheck, Box, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const OrdersPage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      setCancellingId(orderToCancel._id);
      const updatedOrder = await orderService.cancelOrder(orderToCancel._id);
      setOrders(prev => prev.map(o => o._id === orderToCancel._id ? { ...o, ...updatedOrder, orderStatus: 'Cancelled' } : o));
      toast.success('Order cancelled successfully!');
      setOrderToCancel(null);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed': case 'Confirmed': return <ShieldCheck className="size-4 text-pink-600" />;
      case 'Processing': return <Clock className="size-4 text-orange-500" />;
      case 'Packed': return <Box className="size-4 text-purple-500" />;
      case 'Shipped': return <Truck className="size-4 text-blue-500" />;
      case 'Out for Delivery': return <Navigation className="size-4 text-amber-500" />;
      case 'Delivered': return <CheckCircle2 className="size-4 text-green-500" />;
      case 'Cancelled': return <XCircle className="size-4 text-red-500" />;
      default: return <Package className="size-4 text-pink-600" />;
    }
  };

  const trackingStagesList = ['Order Placed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  const getStageIndex = (status) => {
    if (status === 'Confirmed') return 0;
    const idx = trackingStagesList.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="bg-gradient-to-b from-pink-50/20 via-gray-50/50 to-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-100/80 rounded-2xl text-pink-600 shadow-sm">
              <Package className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight italic">My Orders</h1>
              <p className="text-xs text-gray-500 font-medium">Track progress and manage your purchase history</p>
            </div>
          </div>

          <button 
            onClick={fetchOrders}
            className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-pink-600 hover:border-pink-200 transition-colors shadow-sm"
            title="Refresh Orders"
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin text-pink-600' : ''}`} />
          </button>
        </div>

        {loading ? (
          <Loader fullScreen />
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-3xl border-2 border-dashed border-red-200 p-6">
             <p className="text-red-500 font-bold mb-4">{error}</p>
             <button 
               onClick={fetchOrders} 
               className="bg-red-600 text-white font-black px-8 py-3 rounded-xl hover:bg-red-700 transition-all uppercase tracking-widest text-xs shadow-md"
             >
               Retry Loading
             </button>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-8">
            {orders.map((order) => {
              const currentStatus = order.orderStatus || (order.isDelivered ? 'Delivered' : 'Order Placed');
              const isCancelled = currentStatus === 'Cancelled';
              const canCancel = currentStatus !== 'Delivered' && currentStatus !== 'Cancelled';

              const activeStageIdx = getStageIndex(currentStatus);
              const progressPercentage = (activeStageIdx / (trackingStagesList.length - 1)) * 100;

              return (
                <motion.div 
                  key={order._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-pink-100/10 overflow-hidden group hover:border-pink-200/80 transition-all"
                >
                  {/* Order Header Bar */}
                  <div className="p-5 md:p-6 bg-gray-50/80 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex flex-wrap gap-6 md:gap-10">
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-0.5">Order Placed</p>
                        <p className="text-xs font-bold text-gray-800">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-0.5">Total Amount</p>
                        <p className="text-xs font-black text-pink-600">₹{order.totalPrice}</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-0.5">Order Ref</p>
                        <p className="text-xs font-black text-gray-700 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-sm ${
                      isCancelled 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : currentStatus === 'Delivered'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-pink-50 border-pink-200 text-pink-700'
                    }`}>
                      {getStatusIcon(currentStatus)}
                      <span className="text-xs font-black uppercase tracking-wider">{currentStatus}</span>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 space-y-8">
                    {/* Mini Visual Progress Bar Timeline */}
                    {!isCancelled ? (
                      <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-gray-500">
                          <span className="flex items-center gap-1.5 text-pink-600">
                            <Clock className="size-3" /> Live Tracking Progress
                          </span>
                          <span className="font-bold text-gray-400">Stage {activeStageIdx + 1} of 6: <strong className="text-gray-900">{currentStatus}</strong></span>
                        </div>

                        {/* Progress Bar Line */}
                        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 transition-all duration-700 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>

                        {/* Stage Badges */}
                        <div className="grid grid-cols-6 text-center text-[8px] sm:text-[9px] font-black uppercase tracking-tighter pt-1">
                          {trackingStagesList.map((stg, i) => (
                            <span 
                              key={i} 
                              className={i <= activeStageIdx ? 'text-pink-600 font-extrabold' : 'text-gray-400 opacity-60'}
                            >
                              {stg}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-xs font-bold text-red-600 flex items-center justify-between">
                         <span>This order was cancelled. Restored items to stock.</span>
                         <span className="text-[10px] uppercase font-black bg-red-100 text-red-700 px-3 py-1 rounded-full">Cancelled</span>
                      </div>
                    )}

                    {/* Order Items */}
                    <div className="space-y-4">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-center">
                            <div className="size-16 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="font-bold text-gray-900 text-xs md:text-sm line-clamp-1">{item.name}</h4>
                              <p className="text-[11px] text-gray-500 font-medium">Qty: {item.qty} × ₹{item.price}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-gray-900 text-xs md:text-sm">₹{item.price * item.qty}</p>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Order Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
                      <div className="text-xs text-gray-500 font-medium">
                        Shipment Destination: <strong className="text-gray-800">{order.shippingAddress?.city}, {order.shippingAddress?.state}</strong>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 ml-auto">
                        {canCancel && (
                          <button 
                            onClick={() => setOrderToCancel(order)}
                            className="bg-red-50 text-red-600 border border-red-200 text-xs font-black px-4 py-2.5 rounded-xl hover:bg-red-100 transition-all uppercase tracking-wider flex items-center gap-1.5"
                          >
                            <XCircle className="size-4" />
                            Cancel Order
                          </button>
                        )}

                        <Link 
                          to={`/orders/${order._id}`} 
                          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-black px-5 py-2.5 rounded-xl hover:opacity-95 transition-all uppercase tracking-wider flex items-center gap-2 shadow-md shadow-pink-200 active:scale-95"
                        >
                          <Truck className="size-3.5" />
                          Track Timeline
                          <ChevronRight className="size-3.5" />
                        </Link>

                        <button 
                          onClick={async () => {
                            try {
                              for (const item of order.orderItems) {
                                await addToCart({ _id: item.product, name: item.name, price: item.price, images: item.image ? [{ url: item.image }] : [] }, item.qty);
                              }
                              toast.success('Items added to bag!');
                              navigate('/cart');
                            } catch (err) {
                              toast.error('Failed to add items to bag.');
                            }
                          }}
                          className="bg-gray-900 text-white text-xs font-black px-5 py-2.5 rounded-xl hover:bg-black transition-all uppercase tracking-wider active:scale-95"
                        >
                          Buy Again
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-pink-200 p-8 shadow-sm">
             <div className="size-20 bg-pink-50 rounded-3xl flex items-center justify-center mx-auto text-pink-400 mb-6">
               <Package className="size-10" />
             </div>
             <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-2">No Orders Placed Yet</h3>
             <p className="text-gray-500 text-xs mb-8 max-w-sm mx-auto">Explore our wide catalog of makeup, skincare, and beauty items to place your first order!</p>
             <button onClick={() => navigate('/products')} className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black px-8 py-3.5 rounded-2xl hover:scale-105 transition-all uppercase tracking-widest text-xs shadow-xl shadow-pink-200">
               Explore Products Catalog
             </button>
          </div>
        )}

        {/* Cancel Order Confirmation Modal */}
        {orderToCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center space-y-6">
              <div className="size-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-500 border border-red-100">
                <XCircle className="size-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Cancel Order?</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed font-medium">
                  Are you sure you want to cancel order <span className="font-bold text-gray-800 font-mono">#{orderToCancel._id.slice(-8).toUpperCase()}</span>? Stock will be restored to store inventory.
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                <button 
                  onClick={handleCancelOrder}
                  disabled={cancellingId === orderToCancel._id}
                  className="w-full bg-red-600 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-md disabled:opacity-50"
                >
                  {cancellingId === orderToCancel._id ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
                <button 
                  onClick={() => setOrderToCancel(null)}
                  disabled={cancellingId === orderToCancel._id}
                  className="w-full text-gray-500 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:text-gray-800 transition-colors"
                >
                  Keep Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
