import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  // General User OTP Flow
  sendOTP: (email) => api.post('/auth/send-otp', { email }),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  googleLogin: (token) => api.post('/auth/google', { token }),

  // Admin Password Flow
  adminLogin: (email, password) => api.post('/auth/admin-login', { email, password }),
  updateAdminPassword: (oldPassword, newPassword) => api.put('/auth/update-admin-password', { oldPassword, newPassword }),

  // General Login/Register (Backward compatibility)
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),

  // Logout
  logout: () => api.post('/auth/logout'),
};

export default api;
