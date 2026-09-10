import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';
import Loader from '../components/ui/Loader';
import { 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  ChevronRight, 
  Truck, 
  AlertCircle,
  Smartphone,
  Banknote,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Payment Components
import CardForm from '../components/checkout/CardForm';
import UPIForm from '../components/checkout/UPIForm';
import CODOption from '../components/checkout/CODOption';
import SuccessModal from '../components/checkout/SuccessModal';
import AddressModal from '../components/checkout/AddressModal';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [error, setError] = useState(null);
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState('card'); // card, upi, cod
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const shipping = cartTotal > 299 ? 0 : 50;
  const total = cartTotal + shipping;

  useEffect(() => {
    if (cartItems.length === 0 && !loading && !showSuccess) {
      navigate('/cart');
    }

    // Initialize addresses from user profile
    if (user) {
      const initialAddresses = [];
      if (user.address) {
        // Try to parse structured address or use as is
        try {
          const parsed = JSON.parse(user.address);
          if (Array.isArray(parsed)) {
            initialAddresses.push(...parsed);
          } else {
            initialAddresses.push(parsed);
          }
        } catch (e) {
          // Fallback for simple string address
          initialAddresses.push({
            name: user.name || 'Default Name',
            street: user.address,
            city: '',
            state: '',
            zip: '',
            phone: user.phone || '',
            country: 'India',
            label: 'Saved Address'
          });
        }
      }
      setAddresses(initialAddresses);
    }
  }, [cartItems, loading, navigate, showSuccess, user]);

  const handleSaveAddress = async (newAddress) => {
    try {
      setLoading(true);
      const updatedAddresses = [...addresses, { ...newAddress, label: addresses.length === 0 ? 'Home' : 'Work' }];
      
      // Update User Profile
      await updateUser({
        address: JSON.stringify(updatedAddresses),
        phone: newAddress.phone
      });

      setAddresses(updatedAddresses);
      setSelectedAddressIndex(updatedAddresses.length - 1);
      toast.success('Address saved successfully!');
    } catch (err) {
      console.error('Error saving address:', err);
      toast.error('Failed to save address to profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!isPaymentValid) return;

    if (!addresses || addresses.length === 0) {
      toast.error('Please add a shipping address first.');
      return;
    }

    // Pre-flight stock check on cart items
    for (const item of cartItems) {
      if (typeof item.stock === 'number') {
        if (item.stock === 0) {
          const msg = `"${item.name}" is OUT OF STOCK. Please remove it from your bag.`;
          toast.error(msg);
          setError(msg);
          return;
        }
        if (item.quantity > item.stock) {
          const msg = `Only ${item.stock} units of "${item.name}" available in stock. You requested ${item.quantity}. Please update your bag.`;
          toast.error(msg);
          setError(msg);
          return;
        }
      }
    }

    try {
      setPaymentLoading(true);
      setShowSuccess(true);
      setError(null);

      const selectedAddress = addresses[selectedAddressIndex];

      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.quantity,
          image: item.images?.[0]?.url || item.images?.[0],
          price: item.price,
          product: item._id
        })),
        shippingAddress: {
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zip: selectedAddress.zip,
          country: selectedAddress.country || 'India'
        },
        paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 
                       paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery',
        itemsPrice: cartTotal,
        shippingPrice: shipping,
        taxPrice: 0,
        totalPrice: total,
        isPaid: paymentMethod !== 'cod',
        paidAt: paymentMethod !== 'cod' ? new Date().toISOString() : null,
        paymentResult: paymentMethod !== 'cod' ? { id: 'TEST-' + Date.now(), status: 'COMPLETED' } : null
      };

      const createdOrder = await orderService.createOrder(orderData);
      
      setPaymentLoading(false);
      
      // Delay to show success state before redirect
      setTimeout(() => {
        clearCart();
        navigate(`/order-success?orderId=${createdOrder._id}`);
      }, 3000);

    } catch (err) {
      console.error('Error placing order:', err);
      setShowSuccess(false);
      setPaymentLoading(false);

      const serverMessage = err.message || err.response?.data?.message || 'Failed to place order. Please try again.';
      setError(serverMessage);
      toast.error(serverMessage, { duration: 6000, id: 'order-error-toast' });
      
      // Refresh cart to sync live stock levels from MongoDB
      fetchCart();
    }
  };

  const steps = [
    { id: 1, name: 'ADDRESS' },
    { id: 2, name: 'PAYMENT' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {loading && <Loader fullScreen />}
      <SuccessModal show={showSuccess} loading={paymentLoading} />
      <AddressModal 
        isOpen={showAddressModal} 
        onClose={() => setShowAddressModal(false)}
        onSave={handleSaveAddress}
      />
      
      {/* Checkout Header */}
      <div className="bg-white border-b py-8 sticky top-0 z-30">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="flex items-center justify-between gap-4">
              <h1 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Checkout</h1>
              <div className="flex items-center gap-4 md:gap-12">
                {steps.map((s) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className={`size-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${step >= s.id ? 'bg-pink-600 text-white shadow-lg shadow-pink-100' : 'bg-gray-100 text-gray-400'}`}>
                      {s.id}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:inline ${step >= s.id ? 'text-gray-900' : 'text-gray-400'}`}>{s.name}</span>
                  </div>
                ))}
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</p>
                 <p className="text-sm font-black text-pink-600 tracking-tighter">₹{total}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 text-red-600 p-6 rounded-3xl flex items-start gap-4 border border-red-200 shadow-sm"
            >
              <AlertCircle className="size-6 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-red-700">Stock & Order Alert</p>
                <p className="text-sm font-bold text-red-600 leading-snug">{error}</p>
              </div>
            </motion.div>
          )}

          {step === 1 ? (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white rounded-[3rem] p-10 md:p-14 border border-gray-100 shadow-xl shadow-gray-200/50"
             >
               <div className="flex items-center justify-between mb-12">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-4">
                    <div className="size-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600">
                      <MapPin className="size-6" />
                    </div>
                    Shipping Location
                  </h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                   {addresses.map((addr, idx) => (
                     <div 
                       key={idx}
                       onClick={() => setSelectedAddressIndex(idx)}
                       className={`p-8 border-2 rounded-[2.5rem] relative transition-all group cursor-pointer shadow-lg ${
                         selectedAddressIndex === idx 
                         ? 'border-pink-600 bg-pink-50/20 shadow-pink-100/50' 
                         : 'border-gray-100 hover:border-gray-300 bg-white'
                       }`}
                     >
                       <div className="absolute top-6 right-6 text-pink-600 bg-white rounded-full p-2 ring-1 ring-pink-100 shadow-md">
                         {selectedAddressIndex === idx ? <ShieldCheck className="size-5" /> : <div className="size-5 rounded-full border border-gray-100" />}
                       </div>
                       <div className="space-y-1 mb-6">
                          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedAddressIndex === idx ? 'text-pink-600' : 'text-gray-400'}`}>
                            {addr.label || 'Saved Address'}
                          </p>
                          <p className="text-xl font-bold text-gray-900">{addr.name || 'Recipient'}</p>
                       </div>
                       <p className="text-sm text-gray-500 mb-6 leading-relaxed font-medium">
                         {addr.street}, {addr.city},<br />
                         {addr.state} - {addr.zip}, {addr.country || 'India'}
                       </p>
                       <p className="text-xs font-black text-gray-900 uppercase tracking-widest bg-white/60 inline-block px-3 py-1.5 rounded-lg border border-white">
                         {addr.phone}
                       </p>
                     </div>
                   ))}

                   <button 
                     onClick={() => setShowAddressModal(true)}
                     className="p-8 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-pink-600 hover:text-pink-600 transition-all group bg-gray-50/50 min-h-[250px]"
                   >
                     <div className="size-14 rounded-full bg-white flex items-center justify-center group-hover:bg-pink-50 shadow-sm border border-gray-100 transition-all">
                       <span className="text-3xl font-light">+</span>
                     </div>
                     <span className="text-xs font-black uppercase tracking-[0.2em]">Add New Address</span>
                   </button>
                </div>

               <button 
                 onClick={() => {
                   if (addresses.length === 0) {
                     toast.error('Please add a shipping address');
                     return;
                   }
                   setStep(2);
                 }}
                 className="w-full bg-gray-950 text-white font-black py-6 rounded-[2rem] flex items-center justify-center gap-4 hover:bg-black transition-all uppercase tracking-widest shadow-2xl shadow-gray-200 active:scale-[0.98]"
               >
                 Proceed to Payment
                 <ChevronRight className="size-5" />
               </button>
             </motion.div>
          ) : (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white rounded-[3rem] p-8 md:p-14 border border-gray-100 shadow-xl shadow-gray-200/50"
             >
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-4">
                    <div className="size-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600">
                      <CreditCard className="size-6" />
                    </div>
                    Payment Gateway
                  </h2>
                  <button onClick={() => setStep(1)} className="text-pink-600 text-[10px] font-black uppercase tracking-widest underline underline-offset-4 decoration-2">Back to Address</button>
               </div>

               {/* Test Mode Notification */}
               <div className="mb-8 p-4 bg-amber-50 rounded-2xl border border-amber-200/60 flex items-start gap-3">
                  <div className="p-1.5 bg-amber-500/10 text-amber-600 rounded-xl mt-0.5">
                     <AlertCircle className="size-4" />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-0.5">🧪 Test Order Mode Active</p>
                     <p className="text-[11px] text-amber-700/90 leading-relaxed font-medium">
                       Choose any payment method below to place a test order and verify admin dashboard sync. Real Razorpay payment integration will be activated in production.
                     </p>
                  </div>
               </div>

               {/* Tabs */}
               <div className="flex p-2 bg-gray-50 rounded-[2rem] gap-2 mb-12 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'card', name: 'Card', icon: CreditCard },
                    { id: 'upi', name: 'UPI', icon: Smartphone },
                    { id: 'cod', name: 'COD', icon: Banknote },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setPaymentMethod(tab.id);
                        setIsPaymentValid(tab.id === 'cod');
                      }}
                      className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                        paymentMethod === tab.id 
                        ? 'bg-white text-pink-600 shadow-lg shadow-pink-100/50 border border-pink-100' 
                        : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <tab.icon className="size-4" />
                      {tab.name}
                    </button>
                  ))}
               </div>

               {/* Form Area */}
               <div className="mb-12">
                  <AnimatePresence mode="wait">
                     {paymentMethod === 'card' && (
                        <motion.div 
                          key="card" 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          exit={{ opacity: 0, x: 10 }}
                        >
                           <CardForm onValidChange={(v, data) => {
                             setIsPaymentValid(v);
                             setPaymentData(data);
                           }} />
                        </motion.div>
                     )}
                     {paymentMethod === 'upi' && (
                        <motion.div 
                          key="upi" 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          exit={{ opacity: 0, x: 10 }}
                        >
                           <UPIForm onValidChange={(v, data) => {
                             setIsPaymentValid(v);
                             setPaymentData(data);
                           }} />
                        </motion.div>
                     )}
                     {paymentMethod === 'cod' && (
                        <motion.div 
                          key="cod" 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          exit={{ opacity: 0, x: 10 }}
                        >
                           <CODOption onValidChange={(v) => setIsPaymentValid(v)} />
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>

               <button 
                 onClick={handlePlaceOrder}
                 disabled={!isPaymentValid || paymentLoading}
                 className="w-full bg-pink-600 text-white font-black py-6 rounded-[2rem] flex items-center justify-center gap-4 hover:bg-pink-700 transition-all uppercase tracking-[0.2em] shadow-2xl shadow-pink-200 active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:scale-[0.98]"
               >
                 Confirm Payment ₹{total}
                 <ShieldCheck className="size-6" />
               </button>
               
               <p className="text-center mt-8 text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <ShieldCheck className="size-3.5" />
                  Norton Secured • 256-bit SSL Encryption
               </p>
            </motion.div>
          )}
        </div>

        {/* Sidebar Summary */}
        <aside className="space-y-8 sticky top-32 h-fit">
           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50">
             <h3 className="text-sm font-black text-gray-900 mb-8 uppercase tracking-[0.3em] border-b border-gray-50 pb-6 italic">Checkout Summary</h3>
             <div className="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar mb-8 pr-2">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-6 group">
                    <div className="size-16 rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100 group-hover:scale-105 transition-all">
                      <img src={item.images?.[0]?.url || item.images?.[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow space-y-1">
                      <p className="text-xs font-black text-gray-800 line-clamp-1 uppercase tracking-tight">{item.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.brand?.name}</p>
                      <p className="text-[10px] font-black text-pink-600">QTY: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-black text-gray-900 whitespace-nowrap pt-1">₹{item.price * item.quantity}</p>
                  </div>
                ))}
             </div>

             <div className="space-y-4 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border-t border-gray-50 pt-8 text-gray-400">
                <div className="flex justify-between">
                   <span>Bag Subtotal</span>
                   <span className="text-gray-900">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                   <span>Shipping Fee</span>
                   <span className={shipping === 0 ? "text-green-600" : "text-gray-900"}>{shipping === 0 ? 'WAVED OFF' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 -mx-4 px-4 py-4 rounded-2xl mt-4">
                   <span className="text-gray-900 text-[11px]">Total Tax</span>
                   <span className="text-gray-400 text-[11px]">Included</span>
                </div>
             </div>

             <div className="flex justify-between items-end mb-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Total Payable</p>
                <div className="text-right">
                   <span className="text-3xl font-black text-pink-600 tracking-tighter italic block">₹{total}</span>
                </div>
             </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-lg shadow-gray-100/50 space-y-4">
              <div className="flex items-center gap-4 text-green-600">
                 <Truck className="size-6" />
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest italic leading-none mb-1">Express Delivery</p>
                    <p className="text-[11px] font-bold text-gray-400 tracking-tight">Estimated delivery in 3–5 business days</p>
                 </div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
