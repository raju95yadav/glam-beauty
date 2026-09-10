import api from './api';

const productService = {
  getProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getFilterOptions: async () => {
    const response = await api.get('/products/filters');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getProductsByCategory: async (category) => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },

  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured');
    return response.data;
  },

  searchProducts: async (query) => {
    const response = await api.get('/search', { params: { q: query } });
    return response.data;
  },
};

export default productService;
