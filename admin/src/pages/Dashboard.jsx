import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Activity,
  AlertTriangle,
  RefreshCw,
  Box,
  ChevronRight,
  X,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  
  // Quick Restock State
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockProduct, setRestockProduct] = useState(null);
  const [newStockVal, setNewStockVal] = useState(25);
  const [updatingStock, setUpdatingStock] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/stats');
      setStats(data);
      setChartData(data.salesData || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickRestock = async (e) => {
    e.preventDefault();
    if (!restockProduct) return;

    try {
      setUpdatingStock(true);
      const formData = new FormData();
      formData.append('stock', newStockVal);

      await api.put(`/products/${restockProduct._id}`, formData);
      toast.success(`Inventory restocked for "${restockProduct.name}" (${newStockVal} units)`);
      setShowRestockModal(false);
      fetchStats();
    } catch (err) {
      toast.error(err.message || 'Failed to update stock');
    } finally {
      setUpdatingStock(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="size-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Revenue', value: stats?.revenue || 0, icon: <DollarSign size={24} />, color: 'from-green-500/20 to-emerald-500/20', iconColor: 'text-green-500', prefix: '₹', path: '/dashboard' },
    { title: 'Total Orders', value: stats?.orders || 0, icon: <ShoppingCart size={24} />, color: 'from-pink-500/20 to-rose-500/20', iconColor: 'text-pink-500', path: '/orders' },
    { title: 'Products', value: stats?.products || 0, icon: <Package size={24} />, color: 'from-blue-500/20 to-indigo-500/20', iconColor: 'text-blue-500', path: '/manage-products' },
    { title: 'Total Users', value: stats?.users || 0, icon: <Users size={24} />, color: 'from-purple-500/20 to-violet-500/20', iconColor: 'text-purple-500', path: '/users' },
  ];

  const COLORS = ['#ff1493', '#8b5cf6', '#3b82f6', '#10b981'];
  const hasInventoryAlerts = (stats?.lowStockCount > 0 || stats?.outOfStockCount > 0);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-nykaa-text tracking-tight animate-fade-in">Analytics <span className="text-pink-500">Overview</span></h1>
          <p className="text-nykaa-text-muted font-medium mt-1">Real-time performance metrics for your GLAM Beauty project.</p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={fetchStats} className="btn-glass p-3 text-nykaa-text hover:text-pink-500 transition-colors flex items-center gap-2 text-xs font-bold">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Sync Data
           </button>
        </div>
      </div>

      {/* AUTOMATED LOW STOCK & RESTOCK ALERT BANNER */}
      <AnimatePresence>
        {hasInventoryAlerts && (
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2.5rem] bg-gradient-to-r from-amber-500/20 via-red-500/20 to-pink-500/20 border border-amber-500/40 p-6 md:p-8 backdrop-blur-md relative overflow-hidden shadow-xl"
          >
             <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                <div className="flex items-start gap-4">
                   <div className="size-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                      <AlertTriangle className="size-7 animate-pulse text-amber-400" />
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-500 text-white">
                           Automated Inventory Alert
                         </span>
                         <span className="text-xs font-bold text-nykaa-text-muted">
                           {stats.lowStockCount || 0} Low Stock • {stats.outOfStockCount || 0} Out of Stock
                         </span>
                      </div>
                      <h3 className="text-xl font-black text-nykaa-text tracking-tight">
                        Action Required: Items Need Restocking
                      </h3>
                      <p className="text-xs text-nykaa-text-muted font-medium">
                        Products with quantity $\le 5$ items automatically trigger low-stock alerts. Click any item below to restock immediately.
                      </p>

                      {/* Items Pills */}
                      <div className="flex flex-wrap gap-2 pt-2">
                         {stats.lowStockItems?.map((item) => (
                           <button
                             key={item._id}
                             onClick={() => { setRestockProduct(item); setNewStockVal(25); setShowRestockModal(true); }}
                             className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5 hover:scale-105 ${
                               item.stock === 0
                                 ? 'bg-red-500/20 border-red-500/50 text-red-400'
                                 : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                             }`}
                           >
                              <Box className="size-3" />
                              {item.name} ({item.stock === 0 ? 'OUT OF STOCK' : `${item.stock} LEFT`})
                           </button>
                         ))}
                      </div>
                   </div>
                </div>

                <Link
                  to="/manage-products"
                  className="btn-primary py-3.5 px-6 rounded-2xl text-xs uppercase tracking-widest font-black shrink-0 shadow-lg"
                >
                  Manage All Inventory
                </Link>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.path} className="block group">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`glass-card relative overflow-hidden h-full`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 rounded-2xl bg-white/5 ${stat.iconColor} shadow-inner`}>
                    {stat.icon}
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-black ${parseFloat(stats?.growthPercent) >= 0 ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'} px-2 py-1 rounded-lg`}>
                    {parseFloat(stats?.growthPercent) >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stats?.growthPercent || '0.0'}%
                  </div>
                </div>
                <h3 className="text-nykaa-text-muted text-xs font-black uppercase tracking-[0.2em]">{stat.title}</h3>
                <p className="text-3xl font-black text-nykaa-text mt-2 flex items-baseline gap-1">
                  {stat.prefix}
                  <CountUp end={stat.value} duration={2.5} separator="," />
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 glass-card min-h-[450px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black text-nykaa-text">Revenue <span className="text-pink-500">Growth</span></h3>
             <select className="bg-nykaa-surface border border-nykaa-border rounded-xl px-4 py-2 text-xs font-bold outline-none cursor-pointer hover:border-pink-500/50 transition-colors text-nykaa-text shadow-sm">
               <option>Last 7 Days</option>
               <option>Last 30 Days</option>
             </select>
          </div>
          <div className="flex-1 w-full min-h-[400px] relative">
            <ResponsiveContainer width="100%" height={400} debounce={50}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.6)', fontSize: 12, fontWeight: 'bold'}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.6)', fontSize: 12, fontWeight: 'bold'}}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#111827' : '#ffffff', 
                    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', 
                    borderRadius: '16px', 
                    boxShadow: darkMode ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(15,23,42,0.08)'
                  }}
                  itemStyle={{color: darkMode ? '#fff' : '#0f172a', fontSize: '12px', fontWeight: 'bold'}}
                  cursor={{stroke: '#f43f5e', strokeWidth: 2}}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#f43f5e" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorSales)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card flex flex-col"
        >
          <h3 className="text-xl font-black text-nykaa-text mb-8">Category <span className="text-purple-500">Share</span></h3>
          <div className="flex-1 w-full flex items-center justify-center min-h-[300px] relative">
            <ResponsiveContainer width="100%" height={300} debounce={50}>
              <PieChart>
                <Pie
                  data={stats?.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stats?.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{
                     backgroundColor: darkMode ? '#111827' : '#ffffff', 
                     border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', 
                     borderRadius: '12px'
                   }}
                   itemStyle={{color: darkMode ? '#fff' : '#0f172a', fontSize: '11px'}}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-xs font-bold text-nykaa-text-muted ml-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
           <div className="mt-6 pt-6 border-t border-nykaa-border">
              <div className="flex items-center justify-between mb-4">
                 <p className="text-xs font-bold text-nykaa-text-muted uppercase tracking-widest">Main Driver</p>
                 <p className="text-xs font-black text-pink-500 uppercase tracking-widest">
                   {stats?.categoryData?.[0] ? `${stats.categoryData[0].name} (${Math.round((stats.categoryData[0].value / (stats?.products || 1)) * 100)}%)` : 'N/A'}
                 </p>
              </div>
              <p className="text-[10px] text-nykaa-text-muted font-medium italic">{stats?.categoryData?.[0] ? `${stats.categoryData[0].name} products lead your catalog this quarter.` : 'No category data available.'}</p>
           </div>
        </motion.div>
      </div>

      {/* Recent Orders Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xl font-black text-nykaa-text">Recent <span className="text-pink-500">Orders</span></h3>
           <Link to="/orders" className="text-xs font-black text-pink-500 uppercase tracking-widest hover:underline">View All Pipeline</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-nykaa-border uppercase text-[10px] font-black text-nykaa-text-muted tracking-[0.2em]">
                <th className="pb-4">Order ID</th>
                <th className="pb-4">Customer</th>
                <th className="pb-4">Product</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nykaa-border">
              {(stats?.recentOrders && stats.recentOrders.length > 0) ? stats.recentOrders.map((order, i) => {
                const statusColors = {
                  'Delivered': 'bg-green-500/10 text-green-500',
                  'Processing': 'bg-yellow-500/10 text-yellow-500',
                  'Shipped': 'bg-blue-500/10 text-blue-500',
                  'Packed': 'bg-purple-500/10 text-purple-500',
                  'Cancelled': 'bg-red-500/10 text-red-500',
                };
                const statusColor = statusColors[order.orderStatus] || 'bg-gray-500/10 text-gray-500';
                const customerName = order.user?.name || 'Guest';
                const initials = customerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                const firstItem = order.orderItems?.[0]?.name || 'N/A';
                return (
                <tr key={order._id || i} className="group hover:bg-nykaa-surface/5 transition-colors">
                  <td className="py-6 text-sm font-bold text-nykaa-text-muted">#{order._id?.toString().slice(-6).toUpperCase()}</td>
                  <td className="py-6">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 text-[10px] font-black">{initials}</div>
                      <span className="text-sm font-bold text-nykaa-text">{customerName}</span>
                    </div>
                  </td>
                  <td className="py-6 text-sm font-medium text-nykaa-text-muted">{firstItem}</td>
                  <td className="py-6 text-sm font-black text-nykaa-text">₹{order.totalPrice?.toFixed(2)}</td>
                  <td className="py-6 text-right">
                    <span className={`px-3 py-1 ${statusColor} text-[10px] font-black rounded-full uppercase tracking-widest`}>{order.orderStatus || 'Processing'}</span>
                  </td>
                </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-sm text-nykaa-text-muted">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* QUICK RESTOCK MODAL */}
      <AnimatePresence>
        {showRestockModal && restockProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowRestockModal(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-md"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="glass max-w-md w-full p-8 rounded-[2.5rem] relative z-10 border border-nykaa-border shadow-2xl space-y-6"
             >
                <div className="flex justify-between items-center pb-4 border-b border-nykaa-border">
                   <div className="flex items-center gap-3">
                      <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                         <Box size={20} />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-nykaa-text">Quick Restock</h3>
                         <p className="text-[10px] font-bold text-nykaa-text-muted uppercase">Updating Store Inventory</p>
                      </div>
                   </div>
                   <button onClick={() => setShowRestockModal(false)} className="p-2 text-nykaa-text-muted hover:text-nykaa-text">
                      <X size={20} />
                   </button>
                </div>

                <div className="space-y-4">
                   <div className="bg-nykaa-surface/5 p-4 rounded-2xl border border-nykaa-border space-y-1">
                      <p className="text-xs font-black text-nykaa-text">{restockProduct.name}</p>
                      <p className="text-[10px] text-nykaa-text-muted">Current Stock: <strong className="text-amber-500">{restockProduct.stock} items</strong></p>
                   </div>

                   <form onSubmit={handleQuickRestock} className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-nykaa-text-muted uppercase tracking-widest px-1">New Stock Quantity</label>
                         <input 
                           type="number"
                           required
                           min="1"
                           className="input-glass font-black text-lg text-pink-500"
                           value={newStockVal}
                           onChange={(e) => setNewStockVal(Number(e.target.value))}
                         />
                      </div>

                      <div className="flex gap-3">
                         <button 
                           type="button" 
                           onClick={() => setShowRestockModal(false)}
                           className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-nykaa-text-muted glass"
                         >
                            Cancel
                         </button>
                         <button 
                           type="submit"
                           disabled={updatingStock}
                           className="flex-1 btn-primary py-3.5 rounded-xl text-xs uppercase tracking-widest font-black flex items-center justify-center gap-2 shadow-lg"
                         >
                            {updatingStock ? 'Saving...' : 'Save Restock'}
                         </button>
                      </div>
                   </form>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
