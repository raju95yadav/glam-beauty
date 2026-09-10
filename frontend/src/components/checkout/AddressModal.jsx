import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { MapPin, Phone, User, Globe, Home } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AddressModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    country: 'India'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.street || !formData.city || !formData.state || !formData.zip || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    // Simulate slight delay for premium feel
    setTimeout(() => {
      onSave(formData);
      setLoading(false);
      onClose();
    }, 800);
  };

  const inputClasses = "w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all uppercase tracking-widest";
  const labelClasses = "text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block ml-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Shipping Address" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recipient Name */}
          <div className="md:col-span-2">
            <label className={labelClasses}>Recipient Name</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors">
                <User size={14} />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className={`${inputClasses} pl-12`}
                required
              />
            </div>
          </div>

          {/* Street Address */}
          <div className="md:col-span-2">
            <label className={labelClasses}>Street Address</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors">
                <Home size={14} />
              </div>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="House No, Building, Street Name"
                className={`${inputClasses} pl-12`}
                required
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className={labelClasses}>City</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors">
                <MapPin size={14} />
              </div>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City Name"
                className={`${inputClasses} pl-12`}
                required
              />
            </div>
          </div>

          {/* State */}
          <div>
            <label className={labelClasses}>State</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors">
                <Globe size={14} />
              </div>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State Name"
                className={`${inputClasses} pl-12`}
                required
              />
            </div>
          </div>

          {/* Zip Code */}
          <div>
            <label className={labelClasses}>Zip Code</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors">
                <MapPin size={14} />
              </div>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="6-Digit Code"
                className={`${inputClasses} pl-12`}
                required
                maxLength="6"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className={labelClasses}>Phone Number</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors">
                <Phone size={14} />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-Digit Mobile"
                className={`${inputClasses} pl-12`}
                required
                maxLength="10"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-50 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-8 py-5 border border-gray-100 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] bg-gray-950 text-white px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 transition-all shadow-xl shadow-gray-200 hover:shadow-rose-100 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Save & Select Address'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddressModal;
