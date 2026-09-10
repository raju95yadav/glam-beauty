import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Truck, RefreshCw, HelpCircle, Loader2, ChevronRight, Search, MessageCircle } from 'lucide-react';

const iconMap = {
  'order-tracking': Truck,
  'shipping-policy': Shield,
  'return-policy': RefreshCw,
  'faqs': HelpCircle
};

const colorMap = {
  'order-tracking': 'text-blue-600 bg-blue-50 border-blue-100',
  'shipping-policy': 'text-purple-600 bg-purple-50 border-purple-100',
  'return-policy': 'text-orange-600 bg-orange-50 border-orange-100',
  'faqs': 'text-rose-600 bg-rose-50 border-rose-100'
};

const SupportPage = () => {
  const { type } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const Icon = iconMap[type] || HelpCircle;
  const colors = colorMap[type] || colorMap['faqs'];

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/main/support/${type}`);
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching support content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [type]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="size-12 text-rose-600 animate-spin" />
      </div>
    );
  }

  if (!content) return (
    <div className="min-h-screen flex items-center justify-center p-4">
       <div className="text-center space-y-6">
          <div className="size-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
             <Search size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Content Not Found</h2>
          <Link to="/" className="inline-block bg-gray-900 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px]">Return Home</Link>
       </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Tier */}
      <div className="bg-white border-b border-gray-100 pt-24 pb-12 md:pt-32 md:pb-20">
         <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-10">
               <div className="flex items-center gap-6 md:gap-8">
                  <div className={`size-16 md:size-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center border ${colors} shadow-xl shadow-gray-100`}>
                     <Icon className="size-8 md:size-10" />
                  </div>
                  <div>
                     <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-2 md:mb-3 italic">
                        {content.title}
                     </h1>
                     <div className="flex items-center gap-3 md:gap-4">
                        <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Help Center</span>
                        <div className="size-1 bg-gray-200 rounded-full"></div>
                        <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Updated April 2026</span>
                     </div>
                  </div>
               </div>
               
               <div className="hidden lg:flex gap-3">
                  {['order-tracking', 'shipping-policy', 'return-policy', 'faqs'].map((nav) => (
                    <Link 
                      key={nav} 
                      to={`/support/${nav}`}
                      className={`size-12 rounded-2xl flex items-center justify-center transition-all ${nav === type ? 'bg-gray-900 text-white shadow-lg rotate-12' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                       {React.createElement(iconMap[nav], { size: 20 })}
                    </Link>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-5xl py-12 md:py-24">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
            <div className="lg:col-span-8 space-y-8 md:space-y-12">
               {content.sections.map((section, i) => (
                 <motion.section 
                    key={section.id} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 border border-gray-100 shadow-xl shadow-gray-200/20 group hover:border-gray-200 transition-all"
                 >
                    <div className="flex items-start gap-6 md:gap-8">
                       <span className="text-3xl md:text-4xl font-black text-gray-100 group-hover:text-rose-100 transition-colors uppercase tracking-tighter italic leading-none pt-1 md:pt-2">
                         {section.id < 10 ? `0${section.id}` : section.id}
                       </span>
                       <div className="space-y-4 md:space-y-6">
                          <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">{section.title}</h2>
                          <p className="text-gray-500 font-medium leading-relaxed text-base md:text-lg">
                             {section.content}
                          </p>
                       </div>
                    </div>
                 </motion.section>
               ))}
            </div>

            <div className="lg:col-span-4 space-y-8">
               <div className="bg-gray-950 rounded-[3rem] p-10 text-white space-y-8 sticky top-32">
                  <div className="space-y-4">
                     <h3 className="text-xs font-black uppercase tracking-[0.4em] text-rose-500">Need more help?</h3>
                     <p className="text-2xl font-black leading-tight tracking-tighter uppercase italic">Our concierge is here for you.</p>
                  </div>
                  
                  <div className="space-y-4">
                     <button className="w-full bg-white/10 hover:bg-white/20 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 border border-white/5">
                        <MessageCircle size={18} /> Live Chat Now
                     </button>
                     <Link to="/contact" className="w-full bg-rose-600 hover:bg-rose-700 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-xl shadow-rose-950/20">
                        Submit a Ticket <ChevronRight size={18} />
                     </Link>
                  </div>

                  <div className="pt-8 border-t border-white/5 space-y-4">
                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">Average Response Times</p>
                     <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                        <span className="text-gray-400">Chat</span>
                        <span className="text-rose-500">2 Mins</span>
                     </div>
                     <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                        <span className="text-gray-400">Email</span>
                        <span className="text-white">4 Hours</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SupportPage;
