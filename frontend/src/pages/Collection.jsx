import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import AOS from 'aos';
import 'aos/dist/aos.css';

const CATEGORIES = {
  Body: { label: 'Body', subcategories: ['Strat', 'Tele'] },
  Neck: { label: 'Neck', subcategories: ['Strat', 'Tele'] },
  GuitarKits: { label: 'Guitar Kits', subcategories: ['Strat', 'Tele'] },
};

const Collection = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category');

  const { products } = useContext(ShopContext);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [sortType, setSortType] = useState('relavent');
  const [gridView, setGridView] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileFiltersOpen && !event.target.closest('.mobile-filter-panel')) {
        setMobileFiltersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileFiltersOpen]);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  useEffect(() => {
    let results = [...products];

    // Filter by category
    if (selectedCategories.length > 0) {
      results = results.filter(item => selectedCategories.includes(item.category));
    }

    // Filter by subcategory
    if (selectedSubcategories.length > 0) {
      results = results.filter(item => selectedSubcategories.includes(item.subcategory));
    }

    results = sortProducts(results);
    setFilteredProducts(results);
    updateActiveFilterCount();
  }, [products, selectedCategories, selectedSubcategories, sortType]);

  const updateActiveFilterCount = () => {
    let count = 0;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (selectedSubcategories.length > 0) count += selectedSubcategories.length;
    if (sortType !== 'relavent') count += 1;
    setActiveFilterCount(count);
  };

  const sortProducts = (list) => {
    switch (sortType) {
      case 'low-high':
        return [...list].sort((a, b) => a.price - b.price);
      case 'high-low':
        return [...list].sort((a, b) => b.price - a.price);
      default:
        return list;
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  const toggleSubcategory = (subcategory) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategory)
        ? prev.filter(item => item !== subcategory)
        : [...prev, subcategory]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSortType('relavent');
  };

  // Get category counts with their subcategories
  const categoriesWithSubcategories = Object.entries(CATEGORIES).map(([key, value]) => {
    const count = products.filter(p => p.category === key).length;
    const subcategoryCounts = value.subcategories.map(sub => ({
      name: sub,
      count: products.filter(p => p.subcategory === sub && p.category === key).length
    }));

    return {
      name: key,
      label: value.label,
      count,
      subcategories: subcategoryCounts
    };
  });

  return (
    <div className="bg-[#0d0d0d] text-white min-h-screen">
      {/* Mobile Filter Panel */}
      <div className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out transform ${mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-75" onClick={() => setMobileFiltersOpen(false)}></div>
        <div className="mobile-filter-panel absolute right-0 top-0 h-full w-4/5 max-w-md bg-[#1a1a1a] overflow-y-auto">
          <div className="sticky top-0 z-10 bg-[#1a1a1a] p-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold">Filters</h2>
            <button 
              onClick={() => setMobileFiltersOpen(false)}
              className="p-2 rounded-full hover:bg-gray-800"
              aria-label="Close filters"
            >
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Sort Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Sort By</h3>
              <div className="space-y-2">
                {[
                  { value: 'relavent', label: 'Most Relevant' },
                  { value: 'low-high', label: 'Price: Low to High' },
                  { value: 'high-low', label: 'Price: High to Low' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-3 py-2 px-3 rounded-lg bg-[#252525]">
                    <input
                      type="radio"
                      checked={sortType === option.value}
                      onChange={() => setSortType(option.value)}
                      className="h-5 w-5 text-yellow-400 focus:ring-yellow-400"
                    />
                    <span className="text-gray-200">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Categories</h3>
              <div className="space-y-3">
                {categoriesWithSubcategories.map(category => (
                  <div key={category.name} className="bg-[#252525] rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className={`w-full flex justify-between items-center p-3 ${selectedCategories.includes(category.name) ? 'bg-[#333]' : ''}`}
                    >
                      <div className="flex items-center">
                        <span className="font-medium">{category.label}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded-full mr-2">{category.count}</span>
                        <svg 
                          className={`w-5 h-5 transform transition-transform ${selectedCategories.includes(category.name) ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {selectedCategories.includes(category.name) && (
                      <div className="px-3 pb-3 space-y-2">
                        {category.subcategories.map(subcategory => (
                          <label key={subcategory.name} className="flex items-center justify-between pl-4 pr-2 py-2 rounded hover:bg-[#333]">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedSubcategories.includes(subcategory.name)}
                                onChange={() => toggleSubcategory(subcategory.name)}
                                className="h-5 w-5 rounded border-gray-600 text-yellow-400 focus:ring-yellow-400"
                              />
                              <span className="ml-3 text-gray-200">{subcategory.name}</span>
                            </div>
                            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">{subcategory.count}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-[#1a1a1a] pt-4 pb-6 border-t border-gray-800">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    resetFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="py-3 px-4 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="py-3 px-4 rounded-lg bg-yellow-400 text-black font-medium hover:bg-yellow-500 transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-700 py-4 sticky top-0 z-20 bg-[#0d0d0d]">
          <div className="flex justify-between items-center">
            <Title text1="All " text2="Collections" />
            <div className="flex sm:hidden items-center space-x-3">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="relative p-2 rounded-md bg-[#1a1a1a]"
                aria-label="Open filters"
              >
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setGridView(!gridView)}
                className="p-2 rounded-md bg-[#1a1a1a]"
                aria-label={gridView ? "Switch to list view" : "Switch to grid view"}
              >
                {gridView ? (
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-4 mt-3 sm:mt-0">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center space-x-2 bg-[#1a1a1a] px-4 py-2 rounded-md hover:bg-gray-800"
            >
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-yellow-400 text-black text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="relative">
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="appearance-none bg-[#1a1a1a] border border-gray-700 pl-3 pr-8 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400"
              >
                <option value="relavent">Sort: Relevant</option>
                <option value="low-high">Sort: Price (Low to High)</option>
                <option value="high-low">Sort: Price (High to Low)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="hidden md:flex space-x-1 bg-[#1a1a1a] p-1 rounded-md">
              <button
                onClick={() => setGridView(true)}
                className={`p-2 rounded ${gridView ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                aria-label="Grid view"
              >
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setGridView(false)}
                className={`p-2 rounded ${!gridView ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                aria-label="List view"
              >
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-6 pb-12">
          {/* Product Grid */}
          <main>
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <svg className="h-16 w-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-300 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className={
                gridView 
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" 
                  : "space-y-4"
              }>
                {filteredProducts.map((item, index) => (
                  <div
                    key={item._id}
                    data-aos="fade-up"
                    data-aos-delay={(index % 8) * 50} // Limit delay to prevent long waits
                    className={
                      gridView 
                        ? "transform transition-transform hover:scale-[1.02]" 
                        : "bg-[#1a1a1a] rounded-xl overflow-hidden w-full"
                    }
                  >
                    <ProductItem
                      id={item._id}
                      img={item.img}
                      name={item.name}
                      price={item.price}
                      listView={!gridView}
                    />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Collection;