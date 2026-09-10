import api from './api';

const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (productId, qty, price) => {
    const response = await api.post('/cart/add', { productId, qty, price });
    return response.data;
  },

  updateCartItem: async (productId, qty) => {
    const response = await api.put('/cart/update', { productId, qty });
    return response.data;
  },

  removeFromCart: async (productId) => {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  }
};

export default cartService;
