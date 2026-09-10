import React, { useState } from 'react';
import { 
  CheckCircle, 
  RotateCcw, 
  ChevronDown, 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  Tag, 
  Feather, 
  DollarSign, 
  Layers 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterSidebar = ({ 
  categories = [], 
  categoryCounts = [],
  selectedCategories = [], 
  onCategoryChange, 
  
  brands = [],
  brandCounts = [],
  selectedBrands = [],
  onBrandChange,

  skinTypes = [],
  selectedSkinTypes = [],
  onSkinTypeChange,

  ingredients = [],
  selectedIngredients = [],
  onIngredientChange,

  minPrice = 0, 
  maxPrice = 10000, 
  dbMaxPrice = 10000,
  onPriceChange, 

  onClearAll,
  totalActiveFilters = 0,
  isMobile = false
}) => {
  const [brandSearch, setBrandSearch] = useState('');
  const [openSections, setOpenSections] = useState({
    price: true,
    categories: true,
    brands: true,
    skinType: true,
    ingredients: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredBrands = brands.filter(b => 
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const pricePresets = [
    { label: 'Under ₹500', max: 500 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
    { label: 'Above ₹2,000', min: 2000, max: dbMaxPrice || 10000 },
  ];

  const getCategoryCount = (catName) => {
    const item = categoryCounts.find(c => c._id?.toLowerCase() === catName.toLowerCase());
    return item ? item.count : null;
  };

  const getBrandCount = (brandName) => {
    const item = brandCounts.find(b => b._id?.toLowerCase() === brandName.toLowerCase());
    return item ? item.count : null;
  };

  const sidebarContent = (
    <div className="space-y-8">
      {/* Sidebar Header */}
      {!isMobile && (
        <div className="flex justify-between items-center pb-5 border-b border-gray-200/80">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-pink-100/80 flex items-center justify-center text-pink-600">
              <SlidersHorizontal className="size-4" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 uppercase text-[11px] tracking-[0.2em]">Filter By</h3>
              <p className="text-[10px] text-gray-400 font-medium">Narrow down products</p>
            </div>
          </div>

          {totalActiveFilters > 0 && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 text-[10px] font-black text-pink-600 uppercase tracking-wider hover:bg-pink-100 transition-all group"
            >
              <RotateCcw className="size-3 group-hover:rotate-[-180deg] transition-transform duration-500" />
              Clear ({totalActiveFilters})
            </motion.button>
          )}
        </div>
      )}

      {/* 1. Price Range Section */}
      <div className="border-b border-gray-100 pb-6">
        <button 
          onClick={() => toggleSection('price')} 
          className="w-full flex justify-between items-center font-black text-gray-900 uppercase text-[11px] tracking-[0.18em] mb-4 text-left group"
        >
          <span className="flex items-center gap-2">
            <DollarSign className="size-3.5 text-pink-500" />
            Price Point
          </span>
          <ChevronDown className={`size-4 text-gray-400 transition-transform duration-300 ${openSections.price ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {openSections.price && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-5 overflow-hidden"
            >
              {/* Quick Presets */}
              <div className="grid grid-cols-2 gap-2">
                {pricePresets.map((preset, idx) => {
                  const isPresetActive = (preset.min ? minPrice === preset.min : minPrice === 0) && maxPrice === preset.max;
                  return (
                    <button
                      key={idx}
                      onClick={() => onPriceChange(preset.min || 0, preset.max)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black tracking-wider transition-all border text-center ${
                        isPresetActive 
                          ? 'bg-pink-600 border-pink-600 text-white shadow-md shadow-pink-200' 
                          : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-pink-200 hover:bg-pink-50/50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-[10px] font-bold text-gray-500">
                  <span>₹0</span>
                  <span className="text-pink-600 font-black">Up to ₹{maxPrice.toLocaleString()}</span>
                  <span>₹{dbMaxPrice.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={dbMaxPrice || 10000} 
                  step="100"
                  value={maxPrice}
                  onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
                  className="w-full accent-pink-600 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer" 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Categories Section */}
      {categories.length > 0 && (
        <div className="border-b border-gray-100 pb-6">
          <button 
            onClick={() => toggleSection('categories')} 
            className="w-full flex justify-between items-center font-black text-gray-900 uppercase text-[11px] tracking-[0.18em] mb-4 text-left group"
          >
            <span className="flex items-center gap-2">
              <Layers className="size-3.5 text-pink-500" />
              Categories
              {selectedCategories.length > 0 && (
                <span className="size-4 rounded-full bg-pink-600 text-white text-[9px] flex items-center justify-center font-bold">
                  {selectedCategories.length}
                </span>
              )}
            </span>
            <ChevronDown className={`size-4 text-gray-400 transition-transform duration-300 ${openSections.categories ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {openSections.categories && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2.5 overflow-hidden max-h-56 overflow-y-auto pr-1 custom-scrollbar"
              >
                {categories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.toLowerCase());
                  const count = getCategoryCount(cat);
                  return (
                    <label key={cat} className="flex items-center justify-between p-2 rounded-xl hover:bg-pink-50/50 cursor-pointer group transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            className="peer size-4 accent-pink-600 border-2 border-gray-300 rounded-lg appearance-none checked:bg-pink-600 checked:border-pink-600 bg-white transition-all cursor-pointer"
                            checked={isSelected}
                            onChange={() => onCategoryChange(cat.toLowerCase())}
                          />
                          <CheckCircle className="absolute size-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                        </div>
                        <span className={`text-[11px] font-bold tracking-wide transition-colors ${
                          isSelected ? 'text-pink-600 font-black' : 'text-gray-600 group-hover:text-gray-900'
                        }`}>
                          {cat}
                        </span>
                      </div>
                      {count !== null && (
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 group-hover:bg-pink-100 group-hover:text-pink-600 px-2 py-0.5 rounded-full transition-colors">
                          {count}
                        </span>
                      )}
                    </label>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 3. Brands Section */}
      {brands.length > 0 && (
        <div className="border-b border-gray-100 pb-6">
          <button 
            onClick={() => toggleSection('brands')} 
            className="w-full flex justify-between items-center font-black text-gray-900 uppercase text-[11px] tracking-[0.18em] mb-4 text-left group"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-pink-500" />
              Brands
              {selectedBrands.length > 0 && (
                <span className="size-4 rounded-full bg-pink-600 text-white text-[9px] flex items-center justify-center font-bold">
                  {selectedBrands.length}
                </span>
              )}
            </span>
            <ChevronDown className={`size-4 text-gray-400 transition-transform duration-300 ${openSections.brands ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {openSections.brands && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3 overflow-hidden"
              >
                {/* Brand Search input */}
                {brands.length > 5 && (
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search brand..."
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    />
                  </div>
                )}

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {filteredBrands.map((brand) => {
                    const isSelected = selectedBrands.includes(brand.toLowerCase());
                    const count = getBrandCount(brand);
                    return (
                      <label key={brand} className="flex items-center justify-between p-1.5 rounded-xl hover:bg-pink-50/50 cursor-pointer group transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative flex items-center justify-center">
                            <input 
                              type="checkbox" 
                              className="peer size-4 accent-pink-600 border-2 border-gray-300 rounded-lg appearance-none checked:bg-pink-600 checked:border-pink-600 bg-white transition-all cursor-pointer"
                              checked={isSelected}
                              onChange={() => onBrandChange(brand.toLowerCase())}
                            />
                            <CheckCircle className="absolute size-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                          </div>
                          <span className={`text-[11px] font-bold tracking-wide transition-colors ${
                            isSelected ? 'text-pink-600 font-black' : 'text-gray-600 group-hover:text-gray-900'
                          }`}>
                            {brand}
                          </span>
                        </div>
                        {count !== null && (
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 group-hover:bg-pink-100 group-hover:text-pink-600 px-2 py-0.5 rounded-full transition-colors">
                            {count}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 4. Skin Type Section */}
      {skinTypes.length > 0 && (
        <div className="border-b border-gray-100 pb-6">
          <button 
            onClick={() => toggleSection('skinType')} 
            className="w-full flex justify-between items-center font-black text-gray-900 uppercase text-[11px] tracking-[0.18em] mb-4 text-left group"
          >
            <span className="flex items-center gap-2">
              <Feather className="size-3.5 text-pink-500" />
              Skin Type
              {selectedSkinTypes.length > 0 && (
                <span className="size-4 rounded-full bg-pink-600 text-white text-[9px] flex items-center justify-center font-bold">
                  {selectedSkinTypes.length}
                </span>
              )}
            </span>
            <ChevronDown className={`size-4 text-gray-400 transition-transform duration-300 ${openSections.skinType ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {openSections.skinType && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-1">
                  {skinTypes.map((st) => {
                    const isSelected = selectedSkinTypes.includes(st.toLowerCase());
                    return (
                      <button
                        key={st}
                        onClick={() => onSkinTypeChange(st.toLowerCase())}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                          isSelected 
                            ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-pink-600 text-white shadow-md shadow-pink-200 scale-105' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300 hover:bg-pink-50/40'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 5. Key Ingredients Section */}
      {ingredients.length > 0 && (
        <div className="border-b border-gray-100 pb-6">
          <button 
            onClick={() => toggleSection('ingredients')} 
            className="w-full flex justify-between items-center font-black text-gray-900 uppercase text-[11px] tracking-[0.18em] mb-4 text-left group"
          >
            <span className="flex items-center gap-2">
              <Tag className="size-3.5 text-pink-500" />
              Ingredients
              {selectedIngredients.length > 0 && (
                <span className="size-4 rounded-full bg-pink-600 text-white text-[9px] flex items-center justify-center font-bold">
                  {selectedIngredients.length}
                </span>
              )}
            </span>
            <ChevronDown className={`size-4 text-gray-400 transition-transform duration-300 ${openSections.ingredients ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {openSections.ingredients && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ingredients.map((ing) => {
                    const isSelected = selectedIngredients.includes(ing.toLowerCase());
                    return (
                      <button
                        key={ing}
                        onClick={() => onIngredientChange(ing.toLowerCase())}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all border ${
                          isSelected 
                            ? 'bg-pink-100 border-pink-500 text-pink-700 font-black' 
                            : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-300 hover:text-gray-800'
                        }`}
                      >
                        {ing}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Dynamic Banner */}
      <div className="relative rounded-[2rem] bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 p-6 text-white overflow-hidden shadow-xl group">
         <div className="relative z-10">
            <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest mb-3">Glam Exclusive</span>
            <h4 className="font-black text-xl mb-2 leading-tight italic">Find Your Perfect Glow</h4>
            <p className="text-[11px] text-pink-100 font-medium mb-4">Filter by your skin type & favorite ingredients.</p>
         </div>
         <div className="absolute -bottom-10 -right-10 size-36 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
      </div>
    </div>
  );

  if (isMobile) {
    return sidebarContent;
  }

  return (
    <aside className="w-72 flex-shrink-0 hidden lg:block">
      <div className="sticky top-28 bg-white/70 backdrop-blur-xl p-6 rounded-[2.5rem] border border-gray-100/80 shadow-xl shadow-pink-100/20">
        {sidebarContent}
      </div>
    </aside>
  );
};

export default FilterSidebar;
