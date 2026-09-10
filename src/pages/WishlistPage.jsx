import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../hooks/useAuth';
import ProductGrid from '../components/product/ProductGrid';
import Loader from '../components/ui/Loader';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlistItems, loading } = useWishlist();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4">
        <div className="bg-pink-50 p-10 rounded-full mb-8 text-pink-600">
          <Heart className="size-20" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-widest text-center">Login to See Your Wishlist</h2>
        <p className="text-gray-500 mb-10 max-w-sm text-center font-medium">Sign in to save your favorite beauty products and access them from any device.</p>
        <Link to="/login" className="bg-pink-600 text-white font-black px-12 py-4 rounded-2xl hover:bg-pink-700 transition-all uppercase tracking-widest shadow-2xl shadow-pink-100 transform active:scale-95">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) return <Loader fullScreen />;

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4">
        <div className="bg-pink-50 p-10 rounded-full mb-8 text-pink-600 animate-pulse">
          <Heart className="size-20" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-widest text-center">Your Wishlist is Empty!</h2>
        <p className="text-gray-500 mb-10 max-w-sm text-center font-medium">Save items you love here and they'll be waiting for you when you're ready to sparkle.</p>
        <Link to="/products" className="bg-pink-600 text-white font-black px-12 py-4 rounded-2xl hover:bg-pink-700 transition-all uppercase tracking-widest shadow-2xl shadow-pink-100 transform active:scale-95">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-widest">My Wishlist</h1>
        <span className="text-gray-400 font-bold bg-gray-50 px-3 py-1 rounded-full text-sm">({wishlistItems.length})</span>
      </div>

      <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm">
        <ProductGrid products={wishlistItems} loading={false} />
      </div>

      <div className="mt-12 text-center">
         <Link to="/products" className="inline-flex items-center gap-2 text-pink-600 font-black text-sm uppercase tracking-widest hover:gap-4 transition-all group">
           Back to Shopping <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
         </Link>
      </div>
    </div>
  );
};

export default WishlistPage;
