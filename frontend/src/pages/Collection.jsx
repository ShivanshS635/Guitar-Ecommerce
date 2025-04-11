import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Collection = () => {
  const { products } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');
  const [gridView, setGridView] = useState(true); // toggle state

  useEffect(() => {
    AOS.refresh();
  }, [gridView]);
  useEffect(() => {
    AOS.refresh();
  }, [filterProducts]);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const applyFilter = () => {
    let filtered = [...products];
    if (category.length > 0) {
      filtered = filtered.filter((item) => category.includes(item.category));
    }
    setFilterProducts(filtered);
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

  const resetFilters = () => {
    setCategory([]);
    setSortType('relavent');
    setFilterProducts(products);
  };

  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [category]);

  useEffect(() => {
    setFilterProducts((prev) => sortProducts(prev));
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t px-4 sm:px-8">
      {/* Sidebar Filters */}
      <div className="min-w-60 sm:w-1/4">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="text-lg sm:text-xl font-medium flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            src={assets.dropdown}
            alt="Toggle"
            className={`h-5 sm:hidden transition-transform ${showFilter ? '' : '-rotate-90'}`}
          />
        </p>

        <div
          className={`border border-gray-300 pl-5 py-3 mt-4 rounded-md bg-white text-black shadow-sm ${
            showFilter ? '' : 'hidden sm:block'
          }`}
        >
          <p className="mb-3 text-sm font-semibold">Categories</p>
          <div className="flex flex-col gap-3 text-sm font-light text-gray-700">
            {['Body', 'Neck', 'Inlay'].map((cat) => (
              <label key={cat} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={cat}
                  onChange={toggleCategory}
                  checked={category.includes(cat)}
                  className="w-4 h-4"
                />
                {cat.toUpperCase()}
              </label>
            ))}
          </div>

          <button
            onClick={resetFilters}
            className="mt-4 px-3 py-1 bg-yellow-400 text-black rounded text-sm hover:bg-yellow-500"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <Title text1="All " text2="COLLECTIONS" />
          <div className="flex gap-2 items-center">
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm bg-white text-black"
            >
              <option value="relavent">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>

            <button
              onClick={() => setGridView(!gridView)}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              {gridView ? 'List View' : 'Grid View'}
            </button>
          </div>
        </div>

        {filterProducts.length === 0 ? (
          <p className="text-center text-yellow-300 mt-10 text-lg">
            No products match the selected filters.
          </p>
        ) : (
          <div
            className={
              gridView
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'
                : 'flex flex-col gap-5'
            }
          >
            {filterProducts.map((item, index) => (
              <div
                key={item._id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className={gridView ? '' : 'flex gap-4 bg-[#111] p-4 rounded-xl'}
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
      </div>
    </div>
  );
};

export default Collection;
