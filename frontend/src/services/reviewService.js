import api from './api';

const reviewService = {
  addReview: async (productId, reviewData) => {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  }
};

export default reviewService;
