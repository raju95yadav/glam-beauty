import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import { Search, Loader2 } from 'lucide-react';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const performSearch = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const data = await productService.searchProducts(query);
        setProducts(data || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Search className="text-pink-600" />
          Search Results for &quot;{query}&quot;
        </h1>
        <p className="text-sm text-gray-500 mt-1">{products.length} items found</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="size-12 text-pink-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Searching for your beauty favorites...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 mb-6">We couldn&apos;t find any matches for &quot;{query}&quot;</p>
          <div className="max-w-md mx-auto">
             <h3 className="font-bold text-gray-800 mb-4 uppercase tracking-widest text-sm">Try searching for:</h3>
             <div className="flex flex-wrap justify-center gap-2">
               {['Lipstick', 'Face Wash', 'Moisturizer', 'Perfume', 'Mascara'].map((tag) => (
                 <button 
                   key={tag}
                   onClick={() => navigate(`/search?q=${tag}`)}
                   className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium hover:border-pink-500 hover:text-pink-600 transition-all shadow-sm"
                 >
                   {tag}
                 </button>
               ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
