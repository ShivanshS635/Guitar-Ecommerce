import React, { useState, useEffect } from 'react';
import assets from '../assets/assets';
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const Edit = ({ token }) => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [images, setImages] = useState([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Body');
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.post(
          backendUrl + '/api/product/single',
          { id: productId },
          {
            headers: {
              token: token,
            },
          }
        );
        if (response.data.success) {
          const product = response.data.product;
          setName(product.name);
          setDescription(product.description);
          setCategory(product.category);
          setPrice(product.price);
          setCoverImage(product.img[0] || false);
          setImages(product.img || []);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch product data.");
      }
    };

    fetchProductData();
  }, [productId, token]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append('id', productId);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('price', price);

      formData.append('image1', coverImage instanceof File ? coverImage : '');
      formData.append('image2', image2 instanceof File ? image2 : '');
      formData.append('image3', image3 instanceof File ? image3 : '');
      formData.append('image4', image4 instanceof File ? image4 : '');

      const response = await axios.post(
        backendUrl + '/api/product/edit',
        formData,
        {
          headers: {
            token: token,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/list');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={submitHandler} className='flex flex-col w-full items-start gap-3' action="">
      <div>
        <p className='mb-2'>Uploaded Images</p>
        <div className='flex gap-2'>
          {images.map((image, index) => (
            <img
              key={index}
              className="border-2 border-dotted w-20 h-20 bg-gray-200"
              src={image}
              alt={`uploaded-${index}`}
            />
          ))}
        </div>
      </div>

      <div>
        <p className='mb-2'>Update Images</p>
        <div className='flex gap-2'>
          <label htmlFor="image1">
            <img
              className="cursor-pointer border-2 border-dotted w-20 h-20 bg-gray-200"
              src={coverImage instanceof File ? URL.createObjectURL(coverImage) : assets.upload_area}
              alt="upload"
            />
            <input
              onChange={(e) => setCoverImage(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>

          <label htmlFor="image2">
            <img
              className="cursor-pointer border-2 border-dotted w-20 h-20 bg-gray-200"
              src={image2 instanceof File ? URL.createObjectURL(image2) : assets.upload_area}
              alt="upload"
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>

          <label htmlFor="image3">
            <img
              className="cursor-pointer border-2 border-dotted w-20 h-20 bg-gray-200"
              src={image3 instanceof File ? URL.createObjectURL(image3) : assets.upload_area}
              alt="upload"
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>

          <label htmlFor="image4">
            <img
              className="cursor-pointer border-2 border-dotted w-20 h-20 bg-gray-200"
              src={image4 instanceof File ? URL.createObjectURL(image4) : assets.upload_area}
              alt="upload"
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Type Here' required className='w-full max-w-[500px] px-3 py-2' />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <input onChange={(e) => setDescription(e.target.value)} value={description} type="text" placeholder='Type Here' required className='w-full max-w-[500px] px-3 py-2' />
      </div>

      <div className='flex flex-col sm:flex-row gap-3 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product Category</p>
          <select value={category} onChange={(e) => setCategory(e.target.value)}  className='w-full px-3 py-2'>
            <option value="Body">Body</option>
            <option value="Inlay">Inlay</option>
            <option value="Neck">Neck</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='0' />
        </div>
      </div>

      <button className='w-28 py-3 mt-4 bg-black text-white'>Edit Product</button>
    </form>
  );
};

export default Edit;