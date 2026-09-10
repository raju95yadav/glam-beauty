import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { Mail, Phone, MapPin, Send, Loader2, MessageSquare, Clock, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState({ phone: '917857873455', email: 'rajuglamsupport@gmail.com' });

  React.useEffect(() => {
    const fetchAdminContact = async () => {
      try {
        const { data } = await api.get('/main/admin-contact');
        if (data.phone) {
          setAdmin(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error('Failed to fetch admin contact');
      }
    };
    fetchAdminContact();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/main/contact', formData);
      toast.success(response.data.message || 'Message sent successfully!');
      
      // WhatsApp Redirection
      const whatsappText = `Hello! I am ${formData.name}. %0A%0A${formData.message}%0A%0AMy Email: ${formData.email}`;
      const whatsappUrl = `https://wa.me/${admin.phone}?text=${whatsappText}`;
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);

      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
       toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-950 pt-24 pb-16 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-rose-500/10 to-transparent"></div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full mb-6 md:mb-8"
          >
            <span className="text-rose-500 text-[10px] font-black uppercase tracking-[0.4em]">Always Available</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter italic mb-6 md:mb-10 leading-none"
          >
            Let's Start a <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">Conversation</span>
          </motion.h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Whether you have a question about our products, orders, or just want to share some love, we're here for you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-10 md:-mt-20 relative z-20 pb-20 md:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
           {/* Tier 1: Digital Channels */}
           <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6 md:space-y-8 group hover:border-rose-200 transition-all"
              >
                 <div className="size-12 md:size-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
                    <Mail className="size-5 md:size-6" />
                 </div>
                 <div className="space-y-1 md:space-y-2">
                    <h3 className="text-base md:text-lg font-black text-gray-900 uppercase tracking-tight">Email Support</h3>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">For general inquiries and partnership requests.</p>
                 </div>
                 <a href={`mailto:${admin.email}`} className="block text-lg md:text-xl font-bold text-gray-900 hover:text-rose-600 transition-colors break-all">
                   {admin.email}
                 </a>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6 md:space-y-8 group hover:border-green-200 transition-all"
              >
                 <div className="size-12 md:size-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                    <MessageSquare className="size-5 md:size-6" />
                 </div>
                 <div className="space-y-1 md:space-y-2">
                    <h3 className="text-base md:text-lg font-black text-gray-900 uppercase tracking-tight">WhatsApp Live</h3>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">Instant support for your orders and delivery status.</p>
                 </div>
                 <a href={`https://wa.me/${admin.phone}`} target="_blank" className="block text-lg md:text-xl font-bold text-gray-900 hover:text-green-600 transition-colors">
                   + {admin.phone}
                 </a>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="md:col-span-2 bg-gray-50 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-gray-100 space-y-8 md:space-y-10"
              >
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    <div className="space-y-3 md:space-y-4">
                       <div className="flex items-center gap-3 text-rose-600">
                          <Clock size={18} md:size={20} />
                          <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Business Hours</h4>
                       </div>
                       <p className="text-xs md:text-sm text-gray-900 font-bold">Mon - Sat: 10AM - 8PM<br/><span className="text-gray-400 font-medium opacity-60">Sunday: Emergency Only</span></p>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                       <div className="flex items-center gap-3 text-purple-600">
                          <MapPin size={18} md:size={20} />
                          <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Headquarters</h4>
                       </div>
                       <p className="text-xs md:text-sm text-gray-900 font-bold leading-relaxed">Glam Hotel 2nd Floor, <br/>Station Road, Patna (Bihar)</p>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                       <div className="flex items-center gap-3 text-blue-600">
                          <Globe size={18} md:size={20} />
                          <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Corporate</h4>
                       </div>
                       <p className="text-xs md:text-sm text-gray-900 font-bold">corporate@glamportal.com<br/><span className="text-gray-400 font-medium opacity-60">G-200, Business District</span></p>
                    </div>
                 </div>
              </motion.div>
           </div>

           {/* Contact Form */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-gray-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl shadow-rose-200/20 text-white space-y-8 md:space-y-10"
           >
              <div className="space-y-2">
                 <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Send a Message</h2>
                 <p className="text-[9px] md:text-xs text-gray-500 font-medium uppercase tracking-widest italic decoration-rose-500 underline decoration-2 underline-offset-4">We'll get back in 2 hours</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Identifier</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Your Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-[2rem] bg-white/5 border border-white/10 focus:bg-white/10 focus:border-rose-500 outline-none transition-all font-bold text-sm"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Digital Mail</label>
                    <input 
                      type="email" 
                      required
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-[2rem] bg-white/5 border border-white/10 focus:bg-white/10 focus:border-rose-500 outline-none transition-all font-bold text-sm"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">The Inquiry</label>
                    <textarea 
                      required
                      rows="4"
                      placeholder="Share your thoughts..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-6 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-[2rem] bg-white/5 border border-white/10 focus:bg-white/10 focus:border-rose-500 outline-none transition-all font-bold text-sm resize-none"
                    />
                 </div>

                 <button 
                   type="submit"
                   disabled={loading}
                   className="w-full bg-rose-600 text-white font-black py-5 md:py-6 rounded-2xl md:rounded-[2rem] uppercase tracking-widest text-[9px] md:text-[10px] shadow-xl shadow-rose-900/40 hover:bg-rose-700 active:scale-[0.98] transition-all disabled:opacity-50 overflow-hidden relative group"
                 >
                   <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                   {loading ? (
                     <span className="flex items-center justify-center gap-3">
                        <Loader2 className="size-4 animate-spin" /> Transmitting...
                     </span>
                   ) : (
                     <span className="flex items-center justify-center gap-3">
                        <Send className="size-4" /> Finalize Transmission
                     </span>
                   )}
                 </button>
              </form>
           </motion.div>
        </div>
      </div>

      {/* Map Section Placeholder */}
      <div className="h-[300px] md:h-[400px] bg-gray-100 relative grayscale opacity-50 overflow-hidden pointer-events-none mb-20 md:mb-32">
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 p-4">
               <MapPin size={40} md:size={48} className="mx-auto text-gray-300" />
               <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-gray-400">Patna, Bihar, India - 800001</p>
            </div>
         </div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
      </div>
    </div>
  );
};

export default ContactPage;
