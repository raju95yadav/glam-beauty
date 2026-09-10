import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail, 
  ArrowRight, 
  Loader2, 
  CheckCircle2,
  Heart,
  Info,
  Briefcase,
  Phone,
  ShieldCheck,
  Package,
  Truck,
  RefreshCcw,
  HelpCircle
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/main/newsletter', { email });
      setSubscribed(true);
      toast.success('Welcome to the Beauty Circle!');
      setEmail('');
    } catch (error) {
      toast.error('Subscription failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about', icon: Info },
        { label: 'Careers', path: '/careers', icon: Briefcase },
        { label: 'Contact Us', path: '/contact', icon: Phone },
        { label: 'Terms & Conditions', path: '/terms', icon: ShieldCheck },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Order Tracking', path: '/support/order-tracking', icon: Package },
        { label: 'Shipping Policy', path: '/support/shipping-policy', icon: Truck },
        { label: 'Return Policy', path: '/support/return-policy', icon: RefreshCcw },
        { label: 'FAQs', path: '/support/faqs', icon: HelpCircle },
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.1, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="relative bg-white text-gray-500 pt-24 pb-12 overflow-hidden border-t border-gray-100">
      {/* Decorative Gradient Overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-400/5 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-4 max-w-7xl relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Branding Section */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-4">
              <Link to="/">
                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">
                  GLAM Beauty<span className="text-pink-600">.</span>
                </h3>
              </Link>
              <p className="text-sm leading-relaxed max-w-xs">
                Your premier destination for luxury beauty. Curating the finest makeup, skincare, and wellness products since 2026.
              </p>
            </div>
            
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Mail, href: 'mailto:info@nykaaclone.com' }
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  href={social.href}
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-pink-600 hover:text-white transition-all border border-gray-200"
                >
                  <social.icon className="size-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Sections */}
          {footerSections.map((section, idx) => (
            <motion.div variants={itemVariants} key={idx} className="space-y-8">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-[0.3em] italic border-b border-gray-100 pb-4 inline-block">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link 
                      to={link.path} 
                      className="group flex items-center gap-4 text-[13px] font-bold text-gray-400 hover:text-gray-900 transition-all duration-300"
                    >
                      <div className="relative">
                        <span className="size-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-rose-600 group-hover:text-white group-hover:-rotate-12 transition-all duration-500 border border-gray-100 shadow-sm group-hover:shadow-rose-100 group-hover:shadow-lg">
                          <link.icon className="size-4" />
                        </span>
                        {/* Subtle Active Indicator */}
                        <span className="absolute -top-1 -right-1 size-2 bg-rose-500 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 border-2 border-white"></span>
                      </div>
                      <span className="uppercase tracking-widest group-hover:translate-x-1 transition-transform duration-300 decoration-rose-500/30 underline-offset-4 group-hover:underline">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter Section */}
          <motion.div variants={itemVariants} className="space-y-8">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-[0.3em] italic border-b border-gray-100 pb-4 inline-block">
              Join the Circle
            </h4>
            <div className="space-y-6">
              <p className="text-sm text-gray-500">Subscribe for early access to drops and exclusive beauty tips.</p>
              
              <form onSubmit={handleSubscribe} className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Address" 
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 rounded-[2rem] px-8 py-5 text-[11px] font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all pr-14 shadow-sm"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="absolute right-2.5 top-2.5 bottom-2.5 px-3.5 bg-gray-950 text-white rounded-2xl hover:bg-rose-600 transition-all flex items-center justify-center disabled:opacity-50 shadow-lg"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : subscribed ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <ArrowRight className="size-4" />
                  )}
                </button>
              </form>
              
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                 <div className="size-5 rounded-full bg-rose-50 flex items-center justify-center">
                    <Heart className="size-2.5 text-rose-600 fill-rose-600" />
                 </div>
                 Join 10M+ beauty lovers
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
            &copy; {new Date().getFullYear()} Glam Boutique. All Rights Reserved.
          </p>
          <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">
             <span className="hover:text-rose-600 cursor-pointer transition-all hover:-translate-y-0.5">Privacy</span>
             <span className="hover:text-rose-600 cursor-pointer transition-all hover:-translate-y-0.5">Terms</span>
             <span className="hover:text-rose-600 cursor-pointer transition-all hover:-translate-y-0.5">Legal</span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
