import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import CategoryMenu from '../components/layout/CategoryMenu';
import Footer from '../components/layout/Footer';
import { useUI } from '../context/UIContext';
import { AnimatePresence, motion } from 'framer-motion';

const MainLayout = () => {
  const { activeModal, closeModal } = useUI();

  return (
    <div className="flex flex-col min-h-screen selection:bg-pink-100 selection:text-pink-600">
      <AnnouncementBar />
      <Navbar />
      <CategoryMenu />
      
      <main className="flex-grow">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </main>
      
      <Footer />
      
      {/* Global Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-8"
            >
              {/* Modal content based on activeModal */}
               <button 
                  onClick={closeModal}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
               >✕</button>
               {activeModal === 'login' && <div>Login Flow</div>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;
