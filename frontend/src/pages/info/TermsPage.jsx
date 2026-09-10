import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, FileText, Lock, ShieldAlert, Scale, CreditCard, Truck, RefreshCw, AlertCircle, Eye } from 'lucide-react';

const TermsPage = () => {
  const sections = [
    {
      icon: FileText,
      title: "1. Acceptance of Terms",
      content: "By accessing and using Glam Portal, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. Our services are strictly for personal and non-commercial use. If you do not agree to these terms, please discontinue use immediately."
    },
    {
      icon: Lock,
      title: "2. User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility. We reserve the right to terminate accounts that provide false information or violate our safety guidelines."
    },
    {
      icon: CreditCard,
      title: "3. Payments & Billing",
      content: "All transactions are processed through secure, encrypted gateways. We accept major credit/debit cards, UPI, and net banking. Prices are subject to change without notice, but changes will not affect orders already accepted."
    },
    {
      icon: Truck,
      title: "4. Shipping & Delivery",
      content: "Delivery timelines are estimates and not guarantees. We are not liable for delays caused by third-party logistics or force majeure events. Risk of loss passes to you upon delivery to the carrier."
    },
    {
      icon: RefreshCw,
      title: "5. Returns & Refunds",
      content: "Our returns policy is integrated herein. Items must be returned within 15 days in original condition. Refunds are issued to the original payment method and may take 5-7 business days to reflect."
    },
    {
      icon: Eye,
      title: "6. Intellectual Property",
      content: "All content—including logos, designs, text, and images—is the exclusive property of Glam Beauty and protected by international copyright laws. Unauthorized reproduction is strictly prohibited."
    },
    {
      icon: ShieldAlert,
      title: "7. Prohibited Conduct",
      content: "Users may not engage in data mining, use automated bots, or attempt to breach the site's security protocols. Any such action will result in immediate legal pursuit."
    },
    {
      icon: AlertCircle,
      title: "8. Limitation of Liability",
      content: "Glam Beauty shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our services or products."
    },
    {
      icon: Scale,
      title: "9. Governing Law",
      content: "These terms are governed by the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Patna, Bihar."
    },
    {
      icon: Gavel,
      title: "10. Modifications",
      content: "We reserve the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the revised terms."
    }
  ];

  return (
    <div className="bg-white min-h-screen py-16 md:py-32">
       <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-12 md:gap-20"
          >
             {/* Sidebar Info */}
             <div className="md:w-1/3 space-y-8 md:space-y-10">
                <div className="space-y-4 md:space-y-6">
                   <div className="size-16 md:size-20 bg-gray-950 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-gray-200 mx-auto md:mx-0">
                      <Gavel className="size-8 md:size-10" />
                   </div>
                   <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none italic text-center md:text-left">Legal <br className="hidden md:block"/> <span className="text-rose-600">Framework</span></h1>
                </div>
                
                <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Current Iteration</p>
                   <p className="text-sm font-bold text-gray-900 leading-relaxed">Version 2.4.0 <br/> Effective April 18, 2026</p>
                   <div className="h-1 w-12 bg-rose-500 rounded-full"></div>
                   <p className="text-[10px] text-gray-400 font-medium">Please review these terms periodically as they may change without direct notification.</p>
                </div>

                <div className="space-y-4 pt-10">
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 border-l-2 border-rose-500 pl-4">Contact Legal Dept</p>
                   <p className="text-xs text-gray-400 font-medium leading-relaxed pl-4">For legal inquiries: legal@glamportal.com</p>
                </div>
             </div>

             {/* Content Area */}
             <div className="md:w-2/3 space-y-12 md:space-y-16">
                <div className="prose prose-pink max-w-none">
                   <p className="text-gray-500 text-base md:text-lg leading-relaxed font-medium italic border-b border-gray-100 pb-8 md:pb-10">
                      "At Glam Beauty, we prioritize transparency and trust. Our terms are designed to protect both our heritage and our community of beauty enthusiasts."
                   </p>
                </div>

                <div className="space-y-10 md:space-y-16">
                   {sections.map((section, i) => (
                     <motion.section 
                       key={i}
                       initial={{ opacity: 0, x: 20 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: i * 0.05 }}
                       className="group"
                     >
                        <div className="flex items-center gap-4 md:gap-6 mb-3 md:mb-4">
                           <div className="size-8 md:size-10 rounded-lg md:rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-rose-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                              <section.icon size={16} md:size={20} />
                           </div>
                           <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight m-0">{section.title}</h2>
                        </div>
                        <p className="text-gray-500 text-sm md:text-base leading-relaxed pl-12 md:pl-16 font-medium">
                           {section.content}
                        </p>
                     </motion.section>
                   ))}
                </div>

                <div className="pt-20 border-t border-gray-100 flex justify-between items-center">
                   <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em]">Glam Portal Legal © 2026</p>
                   <div className="flex gap-4">
                      <div className="size-2 bg-rose-200 rounded-full"></div>
                      <div className="size-2 bg-rose-400 rounded-full"></div>
                      <div className="size-2 bg-rose-600 rounded-full"></div>
                   </div>
                </div>
             </div>
          </motion.div>
       </div>
    </div>
  );
};

export default TermsPage;
