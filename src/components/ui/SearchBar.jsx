import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import productService from '../../services/productService';

const SearchBar = ({ className = '', onSearchSuccess }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const data = await productService.searchProducts(searchQuery);
      setResults(data.slice(0, 5) || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) fetchSuggestions(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsFocused(false);
      if (onSearchSuccess) onSearchSuccess();
    }
  };

  const handleSelect = (item) => {
    setQuery(item.name);
    navigate(`/product/${item._id}`);
    setIsFocused(false);
    if (onSearchSuccess) onSearchSuccess();
  };

  return (
    <div className={`relative w-full max-w-xl ${className}`}>
      <form onSubmit={handleSearch} className="relative z-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search for products, brands and more"
          className="w-full pl-10 pr-12 py-2.5 bg-gray-100 border border-transparent rounded-xl outline-none focus:bg-white focus:border-pink-300 focus:ring-4 focus:ring-pink-50 transition-all font-medium text-sm text-gray-700"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
        
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-600 size-4 animate-spin" />
        ) : query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </form>

      <AnimatePresence>
        {isFocused && (query.length > 1 || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 z-50 overflow-hidden"
          >
            {results.length > 0 ? (
              <>
                <div className="px-4 mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Suggested Products
                </div>
                <div className="space-y-1">
                  {results.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleSelect(item)}
                      className="w-full px-4 py-3 text-left hover:bg-pink-50 transition-colors flex items-center gap-4 group"
                    >
                      <div className="size-10 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.images?.[0]?.url || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-pink-600">{item.name}</p>
                        <p className="text-[10px] text-gray-400">₹{item.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : query.length > 1 && !loading && (
              <div className="px-4 py-2 text-xs text-gray-500 italic">
                No products found for "{query}"
              </div>
            )}
            <div 
              className="fixed inset-0 bg-transparent -z-10" 
              onClick={() => setIsFocused(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
