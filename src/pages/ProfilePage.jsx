import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Package, MapPin, Heart, LogOut, ChevronRight, Settings, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import ProfileEditModal from '../components/ui/ProfileEditModal';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const menuItems = [
    { icon: Package, label: 'My Orders', desc: 'Track, return or buy things again', path: '/orders' },
    { icon: Heart, label: 'My Wishlist', desc: 'Items you have saved for later', path: '/wishlist' },
    { icon: MapPin, label: 'My Addresses', desc: 'Manage your shipping addresses', path: '/profile' },
    { icon: Bell, label: 'Notifications', desc: 'Stay updated on offers and orders', path: '/profile' },
    { icon: Settings, label: 'Account Settings', desc: 'Update your profile and password', path: '#' },
  ];

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
          <div className="size-24 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 border-4 border-pink-50 shadow-inner">
            <User className="size-12" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name || 'User'}</h1>
            <p className="text-gray-500 mb-4">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <button 
                 onClick={() => setIsEditModalOpen(true)}
                 className="px-4 py-1.5 border border-pink-600 text-pink-600 text-xs font-bold rounded-full hover:bg-pink-600 hover:text-white transition-all uppercase tracking-tighter"
               >
                 Edit Profile
               </button>
               <button 
                 onClick={logout}
                 className="px-4 py-1.5 border border-gray-200 text-gray-400 text-xs font-bold rounded-full hover:border-red-500 hover:text-red-500 transition-all uppercase tracking-tighter flex items-center gap-2"
               >
                 <LogOut className="size-3" /> Logout
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-6">Account Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -3 }}
                onClick={() => {
                  if (item.path === '#') {
                    setIsEditModalOpen(true);
                  } else {
                    navigate(item.path);
                  }
                }}
                className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left flex items-start gap-5 group"
              >
                <div className="p-3 bg-pink-50 rounded-xl text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                  <item.icon className="size-6" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-800 mb-1">{item.label}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
                <ChevronRight className="size-5 text-gray-300 group-hover:text-pink-600 transition-colors" />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-pink-600 to-rose-500 p-8 rounded-2xl text-white shadow-xl shadow-pink-100 relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="font-bold text-xl mb-2">Welcome Back!</h3>
               <p className="text-sm opacity-90 mb-6 font-medium">Enjoy your shopping experience with exclusive deals and fast delivery.</p>
               <Link to="/products" className="bg-white text-pink-600 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-pink-50 transition-colors shadow-lg inline-block">
                 Shop Now
               </Link>
             </div>
             <div className="absolute -bottom-4 -right-4 size-32 bg-white/10 rounded-full blur-2xl"></div>
             <div className="absolute -top-4 -left-4 size-24 bg-white/5 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>

      <ProfileEditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
};

export default ProfilePage;
