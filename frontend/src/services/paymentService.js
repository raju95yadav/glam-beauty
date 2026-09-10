import api from './api';

const paymentService = {
  createRazorpayOrder: async (amount) => {
    const response = await api.post('/payment/razorpay', { amount });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/payment/verify', paymentData);
    return response.data;
  }
};

export default paymentService;
