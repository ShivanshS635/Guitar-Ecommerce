import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import Title from '../../components/Title.jsx';

import axios from 'axios';
import { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';

const categories = [
  { title: 'Custom Bodies', img: assets.body1 },
  { title: 'Custom Necks', img: assets.neck1 },
  { title: 'Custom Inlays', img: assets.inlay1 },
  { title: '3D Design Services', img: assets.print },
];

const CategoryHighlights = () => {

  
  const { token, backendUrl } = useContext(ShopContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    description: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${backendUrl}/api/inquiry/send`,
        {
          service: selectedService,
          name: formData.name,
          phone: formData.phone,
          description: formData.description,
        },
        {
          headers: { Authorization: `Bearer ${token}`},
        }
      );

      if (res.data.success) {
        setFormData({ name: '', phone: '', description: '' });
        setIsModalOpen(false);
        toast.success('Inquiry Sent Sucessfully');
      } else {
        alert('Failed to send inquiry');
      }
    } catch (error) {
      toast.error('Error sending inquiry' + error.response.data.message);
    }
  };


  const openModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <section id="categories" className="py-16 bg-black text-white text-center relative">
      <Title text1={'Custom '} text2={'Services'} />
      <div className="grid grid-cols-1 mt-5 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-20">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="bg-neutral-800 rounded-lg overflow-hidden shadow-lg hover:shadow-yellow-500/30 transition"
          >
            <img src={cat.img} className="w-full h-48 object-cover" alt={cat.title} />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{cat.title}</h3>
              <button
                onClick={() => openModal(cat.title)}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-16 py-3 text-sm rounded-full hover:opacity-90 active:scale-95 transition-transform"
              >
                Inquiry
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inquiry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center">
          <div className="bg-white text-black w-[90%] max-w-lg p-6 rounded-xl shadow-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-black"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-center">Inquiry - {selectedService}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <textarea
                name="description"
                placeholder="Description of Custom Product"
                required
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded h-32"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded transition"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default CategoryHighlights;
