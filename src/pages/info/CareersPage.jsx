import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { Briefcase, MapPin, Search, Loader2, Sparkles, ArrowRight, CheckCircle2, Star } from 'lucide-react';

const CareersPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/main/jobs');
        setJobs(response.data);
      } catch (err) {
        console.error('Job fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20 md:pb-32">
      {/* Hero */}
      <div className="bg-white pt-24 pb-16 md:pt-40 md:pb-32 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-rose-50/50 -skew-x-12 translate-x-1/2 opacity-50"></div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-600/10 text-rose-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 md:mb-10"
          >
             <Star size={12} className="fill-rose-600" /> Shaping the Future
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black text-gray-900 uppercase tracking-tighter mb-6 md:mb-10 italic leading-[0.9]"
          >
            Join <span className="text-rose-600 underline decoration-rose-200 decoration-8 underline-offset-[8px] md:underline-offset-[12px]">Glam</span> Portal
          </motion.h1>
          <p className="text-lg md:text-2xl text-gray-400 font-medium max-w-2xl leading-relaxed">
            We're looking for visionary thinkers and relentless executors to build the world's most elegant beauty ecosystem.
          </p>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="container mx-auto px-4 py-12 md:py-24 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-8 md:gap-10 mb-12 md:mb-20 border-b border-gray-100 pb-8 md:pb-10">
           <div className="space-y-2 md:space-y-4">
              <h2 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.4em]">Available Roles</h2>
              <p className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter">Current Openings</p>
           </div>
           <div className="relative group w-full md:min-w-[320px]">
              <input 
                type="text" 
                placeholder="Find your next challenge..." 
                className="w-full bg-white border border-gray-100 pl-12 md:pl-14 pr-6 py-4 md:py-5 rounded-2xl text-sm font-bold shadow-sm focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all"
              />
              <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 size-4 md:size-5 text-gray-300 pointer-events-none group-focus-within:text-rose-600 transition-colors" />
           </div>
        </div>

        {loading ? (
          <div className="flex justify-center flex-col items-center py-32 gap-6 bg-white rounded-[4rem] border border-gray-100 italic">
             <Loader2 className="size-12 text-rose-600 animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Scanning for talent...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
            {jobs.map((job) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => setSelectedJob(job === selectedJob ? null : job)}
                className={`
                  bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border transition-all cursor-pointer group relative overflow-hidden
                  ${selectedJob === job ? 'border-rose-600 ring-4 ring-rose-500/10' : 'border-gray-100 hover:border-rose-200 hover:shadow-2xl hover:shadow-rose-100/50'}
                `}
              >
                 <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
                    <div className="space-y-2 md:space-y-3">
                       <span className="inline-block px-3 py-1 bg-gray-50 text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-lg group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                         {job.department}
                       </span>
                       <h3 className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-rose-600 transition-colors tracking-tight">{job.title}</h3>
                    </div>
                    <div className="size-10 md:size-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-rose-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                       <ArrowRight size={18} md:size={20} />
                    </div>
                 </div>

                 <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 relative z-10 font-medium">
                   {job.description}
                 </p>

                 <div className="flex items-center gap-4 md:gap-6 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 md:mb-8 relative z-10">
                    <span className="flex items-center gap-2"><Briefcase className="size-3.5 md:size-4" /> Full-Time</span>
                    <span className="flex items-center gap-2"><MapPin className="size-3.5 md:size-4" /> {job.location}</span>
                 </div>

                 <AnimatePresence>
                   {selectedJob === job && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden border-t border-gray-100 pt-8 mt-4 space-y-8"
                     >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                                <Sparkles size={12} className="text-rose-500" /> Requirements
                              </h4>
                              <ul className="space-y-3">
                                 {job.requirements.map((req, i) => (
                                   <li key={i} className="flex items-start gap-2 text-xs text-gray-500 font-medium">
                                      <CheckCircle2 size={14} className="text-rose-500 shrink-0 mt-0.5" />
                                      {req}
                                   </li>
                                 ))}
                              </ul>
                           </div>
                           <div className="space-y-4">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                                <Star size={12} className="text-purple-500" /> Perks
                              </h4>
                              <ul className="space-y-3">
                                 {job.perks.map((perk, i) => (
                                   <li key={i} className="flex items-start gap-2 text-xs text-gray-500 font-medium">
                                      <CheckCircle2 size={14} className="text-purple-500 shrink-0 mt-0.5" />
                                      {perk}
                                   </li>
                                 ))}
                              </ul>
                           </div>
                        </div>
                        <button className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-all shadow-xl shadow-gray-200 hover:shadow-rose-100">
                           Submit Application
                        </button>
                     </motion.div>
                   )}
                 </AnimatePresence>
                 
                 {/* Decorative Background Element */}
                 <div className="absolute -bottom-10 -right-10 size-40 bg-rose-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Hiring Process */}
      <div className="container mx-auto px-4 max-w-6xl py-20 md:py-32">
         <div className="bg-gray-950 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rose-900/20 to-transparent"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
               <div className="space-y-6 md:space-y-8">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 italic">How we hire</h2>
                  <p className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter uppercase italic">The Path to <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-500">Excellence</span></p>
                  <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-md">Our process is rigorous, fair, and designed to find high-velocity individuals who love solving complex problems.</p>
               </div>
               <div className="space-y-8 md:space-y-12">
                  {[
                    { step: '01', title: 'Application Review', text: 'We look for bold portfolios and clear evidence of impact.' },
                    { step: '02', title: 'Cultural Sync', text: 'A deep dive into your vision and how it aligns with Glam Portal.' },
                    { step: '03', title: 'Technical Deep-Dive', text: 'Solving real-world architectural challenges with the team.' },
                    { step: '04', title: 'Final Onboarding', text: 'Join the mission and start building the heritage.' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 md:gap-8 group">
                       <span className="text-2xl md:text-3xl font-black text-gray-800 group-hover:text-rose-500 transition-colors uppercase tracking-tighter italic">{item.step}</span>
                       <div className="space-y-1 md:space-y-2">
                          <h4 className="text-base md:text-lg font-bold text-white uppercase tracking-tight">{item.title}</h4>
                          <p className="text-[11px] md:text-sm text-gray-500 font-medium leading-relaxed">{item.text}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CareersPage;
