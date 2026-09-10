import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { lazy, Suspense } from 'react';
import Loader from '../components/ui/Loader';

// Layouts
import MainLayout from '../layouts/MainLayout';
import ScrollToTop from '../components/common/ScrollToTop';

// Lazy Loaded Pages
const HomePage = lazy(() => import('../pages/HomePage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const ProductDetailsPage = lazy(() => import('../pages/ProductDetailsPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const AuthPage = lazy(() => import('../pages/AuthPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const OTPVerificationPage = lazy(() => import('../pages/OTPVerificationPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const WishlistPage = lazy(() => import('../pages/WishlistPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const OrdersPage = lazy(() => import('../pages/OrdersPage'));
const SearchResultsPage = lazy(() => import('../pages/SearchResultsPage'));
const LoginSuccessPage = lazy(() => import('../pages/LoginSuccessPage'));
const CategoryProducts = lazy(() => import('../pages/CategoryProducts'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Info & Support Pages
const AboutPage = lazy(() => import('../pages/info/AboutPage'));
const CareersPage = lazy(() => import('../pages/info/CareersPage'));
const ContactPage = lazy(() => import('../pages/info/ContactPage'));
const TermsPage = lazy(() => import('../pages/info/TermsPage'));
const SupportPage = lazy(() => import('../pages/info/SupportPage'));
const OrderSuccessPage = lazy(() => import('../pages/OrderSuccessPage'));
const OrderTrackingPage = lazy(() => import('../pages/OrderTrackingPage'));

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    }>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/category/:categoryName" element={<CategoryProducts />} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<OTPVerificationPage />} />
          <Route path="/login-success" element={<LoginSuccessPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wishlist" 
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<Loader />}>
                   <OrdersPage />
                </Suspense>
              </ProtectedRoute>
            } 
          />

          {/* Info & Support Routes */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/support/:type" element={<SupportPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
