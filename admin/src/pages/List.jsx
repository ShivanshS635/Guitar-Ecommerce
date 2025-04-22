import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const List = ({ token }) => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [expanded, setExpanded] = useState({});

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success('Product removed successfully');
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const groupedByCategory = list.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="space-y-8 text-gray-700 px-2 sm:px-4">
      <h2 className="text-2xl font-bold text-black mb-4">All Products (By Category)</h2>

      {Object.entries(groupedByCategory).map(([category, products]) => (
        <div key={category} className="bg-white rounded-xl border border-gray-200 shadow">
          <button
            className="flex items-center justify-between w-full px-4 sm:px-6 py-4 bg-gray-100 text-left rounded-t-xl hover:bg-gray-200 transition"
            onClick={() =>
              setExpanded((prev) => ({ ...prev, [category]: !prev[category] }))
            }
          >
            <div className="text-lg font-semibold text-green-800 uppercase">{category}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{products.length} items</span>
              {expanded[category] ? (
                <FaChevronUp className="transition-transform duration-300" />
              ) : (
                <FaChevronDown className="transition-transform duration-300" />
              )}
            </div>
          </button>

          <div
            className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 px-4 pb-4 transition-all duration-500 ease-in-out ${
              expanded[category] ? 'max-h-[999px] opacity-100 pt-4' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            {products.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-100 shadow hover:shadow-lg rounded-xl overflow-hidden transition-all duration-300 flex flex-col"
              >
                <div className="w-full h-48 sm:h-44 overflow-hidden">
                  <img
                    src={item.img[0]}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-3 space-y-2 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-semibold text-gray-800 truncate">{item.name}</h4>
                      <span className="text-yellow-600 font-bold text-sm">{currency}{item.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => navigate(`/edit/${item._id}`)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 rounded transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white text-xs py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default List;
