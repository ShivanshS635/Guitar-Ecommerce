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
  const [activeFilterTab, setActiveFilterTab] = useState(null);

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
    setActiveFilterTab(null);
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
      {/* Mobile Filters */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-75 flex transition-opacity duration-300 md:hidden">
          <div className="relative ml-auto h-full w-full max-w-xs flex-col bg-[#1a1a1a] p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close">
                <img src={assets.close} alt="close" className="h-6 w-6 invert" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-gray-300 mb-2">Categories</h3>
                <div className="space-y-4">
                  {categoriesWithSubcategories.map(category => (
                    <div key={category.name}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleCategory(category.name)}
                            className={`w-5 h-5 border rounded flex items-center justify-center ${selectedCategories.includes(category.name)
                              ? 'bg-yellow-400 border-yellow-400'
                              : 'border-gray-500'
                              }`}
                          >
                            {selectedCategories.includes(category.name) && (
                              <svg className="w-3 h-3 text-black" viewBox="0 0 12 12" fill="none">
                                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </button>
                          <span className="ml-3 text-sm text-gray-300">{category.label}</span>
                        </div>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">{category.count}</span>
                      </div>

                      {/* Subcategories */}
                      {selectedCategories.includes(category.name) && (
                        <div className="ml-8 mt-2 space-y-3">
                          {category.subcategories.map(subcategory => (
                            <div key={subcategory.name} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <button
                                  onClick={() => toggleSubcategory(subcategory.name)}
                                  className={`w-5 h-5 border rounded flex items-center justify-center ${selectedSubcategories.includes(subcategory.name)
                                    ? 'bg-yellow-400 border-yellow-400'
                                    : 'border-gray-500'
                                    }`}
                                >
                                  {selectedSubcategories.includes(subcategory.name) && (
                                    <svg className="w-3 h-3 text-black" viewBox="0 0 12 12" fill="none">
                                      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </button>
                                <span className="ml-3 text-sm text-gray-300">{subcategory.name}</span>
                              </div>
                              <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">{subcategory.count}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="w-full bg-yellow-400 text-black rounded-md py-2 font-medium hover:bg-yellow-500"
              >
                Reset all filters
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-700 py-6 sticky top-20 z-20 bg-[#0d0d0d]">
          <Title text1="All " text2="Collections" />
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 mt-4 sm:mt-0">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="group flex items-center text-sm font-medium hover:text-gray-300"
            >
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-1.5 bg-yellow-400 text-black text-xs font-semibold px-1.5 py-0.5 rounded">
                  {activeFilterCount}
                </span>
              )}
              <img src={assets.filter} alt="filter" className="ml-2 h-4 w-4 invert opacity-70 group-hover:opacity-100" />
            </button>

            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="bg-[#1a1a1a] border border-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-800"
            >
              <option value="relavent">Sort: Relevant</option>
              <option value="low-high">Sort: Price (Low to High)</option>
              <option value="high-low">Sort: Price (High to Low)</option>
            </select>

            <button
              onClick={() => setGridView(!gridView)}
              className="p-2 border border-gray-700 rounded-md hover:bg-gray-800"
            >
              {gridView ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Full-width Filter jsdjds Navigation */}
        <div className="hidden md:block sticky top-24 z-40 backdrop-blur-md bg-black/70 border-b border-yellow-400/20 shadow-md">
          {/* Category Buttons */}
          <div className="overflow-x-auto no-scrollbar px-4 py-4 flex items-center gap-3 sm:gap-4 md:gap-6">
            {categoriesWithSubcategories.map((category) => {
              const isSelected = selectedCategories.includes(category.name);
              const isActive = activeFilterTab === category.name;

              return (
                <button
                  key={category.name}
                  onClick={() => {
                    toggleCategory(category.name);
                    setActiveFilterTab(isActive ? null : category.name);
                  }}
                  className={`shrink-0 text-sm font-semibold px-5 py-2 rounded-full border transition duration-200
              ${isSelected
                      ? 'bg-yellow-400 text-black border-yellow-400 shadow-inner'
                      : isActive
                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                        : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-yellow-500/20 hover:text-yellow-300'
                    }
            `}
                  aria-pressed={isSelected || isActive}
                >
                  {category.label}
                  {category.count > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-yellow-400 border border-yellow-400/40">
                      {category.count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Clear All Filters Button */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-red-900/90 text-white hover:bg-red-800 transition border border-red-600/40"
              >
                Clear All
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Subcategories Section */}
          {activeFilterTab && (
            <div className="px-6 py-4 border-t border-gray-800 bg-[#121212]">
              <h3 className="text-xs font-bold text-yellow-400 uppercase mb-4 tracking-wider select-none">
                {CATEGORIES[activeFilterTab]?.label} Subcategories
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categoriesWithSubcategories
                  .find(c => c.name === activeFilterTab)
                  ?.subcategories.map((subcategory) => (
                    <label
                      key={subcategory.name}
                      className="flex items-center justify-between bg-[#1e1e1e] hover:bg-[#2a2a2a] rounded-lg px-4 py-2 border border-gray-700 hover:border-yellow-500 cursor-pointer transition select-none"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedSubcategories.includes(subcategory.name)}
                          onChange={() => toggleSubcategory(subcategory.name)}
                          className="h-5 w-5 accent-yellow-400"
                        />
                        <span className="text-sm text-gray-200">{subcategory.name}</span>
                      </div>
                      <span className="text-xs bg-gray-700 text-yellow-300 px-2 py-0.5 rounded-full font-semibold">
                        {subcategory.count}
                      </span>
                    </label>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="pt-6 pb-12">
          {/* Product Grid */}
          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <svg className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-300">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-md font-medium"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className={gridView ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-6"}>
                {filteredProducts.map((item, index) => (
                  <div
                    key={item._id}
                    data-aos="fade-up"
                    data-aos-delay={index * 80}
                    className={gridView ? "" : "flex gap-4 bg-[#1a1a1a] p-4 rounded-xl"}
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
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Collection;