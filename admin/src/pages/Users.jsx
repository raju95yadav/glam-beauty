import React, { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users as UsersIcon, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  User as UserIcon,
  ChevronRight,
  MoreVertical,
  Filter,
  Trash2,
  AlertCircle
} from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/users');
      setUsers(data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      setIsDeleting(true);
      await api.delete(`/admin/user/${selectedUser._id}`);
      toast.success('User removed from platform');
      setUsers(users.filter(u => u._id !== selectedUser._id));
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.message || error.response?.data?.message || 'Failed to remove user');
    } finally {
      setIsDeleting(false);
      setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="size-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-nykaa-text tracking-tight">User <span className="text-pink-500">Directory</span></h1>
          <p className="text-nykaa-text-muted font-medium mt-1">Managing {users.length} registered beauty enthusiasts.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nykaa-text-muted group-focus-within:text-pink-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, email, phone..."
              className="input-glass pl-12 text-sm font-medium text-nykaa-text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="glass p-3.5 rounded-2xl text-nykaa-text-muted hover:text-nykaa-text transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Users List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4"
      >
        <div className="hidden lg:grid grid-cols-12 px-8 py-4 text-[10px] font-black text-nykaa-text-muted uppercase tracking-[0.2em] border-b border-nykaa-border">
          <div className="col-span-4">User Details</div>
          <div className="col-span-3">Contact Info</div>
          <div className="col-span-2">Joined Date</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {filteredUsers.map((user) => (
          <motion.div 
            key={user._id}
            variants={itemVariants}
            className="glass-card group hover:bg-pink-500/5 transition-all p-4 lg:px-8 lg:py-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4">
              {/* User Identity */}
              <div className="lg:col-span-4 flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-600/10 flex items-center justify-center text-pink-500 shadow-inner group-hover:scale-110 transition-transform">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-nykaa-text">
                    {user.name || (user.email ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : 'Member')}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-nykaa-text-muted">
                    <span className="size-2 bg-emerald-500 rounded-full"></span>
                    {user.role === 'admin' ? 'System Administrator' : 'Active Account'}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-3 space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-nykaa-text">
                  <Mail size={14} className="text-pink-500/70" />
                  {user.email}
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 text-xs font-medium text-nykaa-text-muted">
                    <Phone size={14} />
                    {user.phone}
                  </div>
                )}
              </div>

              {/* Joined Date */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 text-sm font-bold text-nykaa-text">
                  <Calendar size={14} className="text-blue-500/70" />
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Role */}
              <div className="lg:col-span-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  user.role === 'admin' 
                    ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' 
                    : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                }`}>
                  {user.role}
                </span>
              </div>

              {/* Actions */}
              <div className="lg:col-span-1 text-right">
                <button 
                  onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                  className="size-10 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all ml-auto group/btn"
                >
                  <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredUsers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-20 text-center glass-card border-dashed border-2 border-nykaa-border"
          >
            <UsersIcon size={48} className="text-nykaa-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-black text-nykaa-text">No users found</h3>
            <p className="text-nykaa-text-muted mt-2">Try adjusting your search criteria.</p>
          </motion.div>
        )}
      </motion.div>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-nykaa-surface max-w-sm w-full p-8 rounded-3xl relative z-10 border border-nykaa-border shadow-2xl text-center"
            >
              <div className="size-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="text-red-500" size={32} />
              </div>
              <h3 className="text-2xl font-black text-nykaa-text mb-2 tracking-tight">Remove User?</h3>
              <p className="text-nykaa-text-muted text-xs font-medium mb-8 leading-relaxed">
                 Are you sure you want to remove <span className="text-nykaa-text font-black">"{selectedUser?.name || selectedUser?.email}"</span>? They will be logged out and deleted permanently.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  disabled={isDeleting}
                  onClick={handleDeleteUser}
                  className="w-full bg-red-500 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest text-white hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {isDeleting ? 'Removing...' : 'Confirm Removal'}
                </button>
                <button 
                  disabled={isDeleting}
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-3.5 text-nykaa-text-muted font-bold text-xs uppercase tracking-widest hover:text-nykaa-text transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;
