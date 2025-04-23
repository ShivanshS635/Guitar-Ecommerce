import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { backendUrl } from '../App';
import { FiX, FiCheck, FiLoader, FiTrash2, FiUpload, FiImage } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Edit = ({ token }) => {
    const { id: productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [newImages, setNewImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await axios.post(
                    `${backendUrl}/api/product/single`,
                    { id: productId },
                    { headers: { token } }
                );

                if (response.data.success) {
                    const product = response.data.product;
                    setProduct(product);
                    setLoading(false);
                } else {
                    setErrorMessage('Product not found');
                    setLoading(false);
                }
            } catch (error) {
                setErrorMessage('Failed to fetch product data');
                setLoading(false);
            }
        };

        fetchProductData();
    }, [productId, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleNewImages = (e) => {
        const files = Array.from(e.target.files);
        if (newImages.length + files.length > 4) {
            toast.error('Maximum 4 new images allowed');
            return;
        }
        setNewImages([...newImages, ...files]);
    };

    const removeExistingImage = (index) => {
        setImagesToDelete([...imagesToDelete, product.img[index]]);
        setProduct(prev => ({
            ...prev,
            img: prev.img.filter((_, i) => i !== index)
        }));
    };

    const removeNewImage = (index) => {
        setNewImages(newImages.filter((_, i) => i !== index));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const formData = new FormData();
            
            // Append product data
            formData.append('name', product.name);
            formData.append('description', product.description);
            formData.append('price', product.price);
            formData.append('category', product.category);

            // Append new images
            newImages.forEach((img) => {
                formData.append('newImages', img);
            });

            // Append images to delete
            imagesToDelete.forEach(img => {
                formData.append('imagesToDelete', img);
            });

            const response = await axios.post(
                `${backendUrl}/api/product/edit/${productId}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                setSuccessMessage('Product updated successfully!');
                setProduct(response.data.product);
                setNewImages([]);
                setImagesToDelete([]);
            } else {
                setErrorMessage(response.data.message || 'Failed to update product');
            }
        } catch (error) {
            console.error('Update error:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to update product');
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
                <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg text-gray-600">Loading product details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">The product you're trying to edit doesn't exist or you don't have permission to access it.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition duration-300"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Edit Product
                    </h1>
                    <p className="mt-3 text-xl text-gray-500">
                        Update your product details and images
                    </p>
                </div>

                {(successMessage || errorMessage) && (
                    <div className={`mb-8 p-4 rounded-lg ${successMessage ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        <div className="flex items-center">
                            {successMessage ? (
                                <FiCheck className="mr-2 text-green-600" size={20} />
                            ) : (
                                <FiX className="mr-2 text-red-600" size={20} />
                            )}
                            <span>{successMessage || errorMessage}</span>
                        </div>
                    </div>
                )}

                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <form onSubmit={handleUpdate} className="p-6 sm:p-8 space-y-6">
                        {/* Product Details */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={product.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                    Price
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={product.price}
                                        onChange={handleInputChange}
                                        className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={product.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                            >
                                <option value="Body">Body</option>
                                <option value="Inlay">Inlay</option>
                                <option value="Neck">Neck</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={product.description}
                                onChange={handleInputChange}
                                rows="6"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                                placeholder="Enter product description"
                            />
                        </div>

                        {/* Image Management */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Images</h3>
                            {product.img && product.img.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                                    {product.img.map((imageUrl, index) => (
                                        <div key={index} className="relative group">
                                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={imageUrl}
                                                    alt={`Product image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                                        e.target.replaceWith(
                                                            <div className="text-gray-400 flex flex-col items-center">
                                                                <FiImage size={24} />
                                                                <span className="text-xs mt-1">Image not available</span>
                                                            </div>
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                                title="Remove image"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                                    <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
                                    <p className="mt-1 text-sm text-gray-500">Add some product images below</p>
                                </div>
                            )}

                            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Images</h3>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                <div className="space-y-1 text-center">
                                    <div className="flex justify-center text-gray-600">
                                        <FiUpload size={24} className="mx-auto" />
                                    </div>
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500 focus-within:outline-none"
                                        >
                                            <span>Upload files</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                onChange={handleNewImages}
                                                multiple
                                                accept="image/*"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </div>
                            </div>

                            {newImages.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">New images to upload:</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {newImages.map((file, index) => (
                                            <div key={index} className="relative group">
                                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`New image ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                                    title="Remove image"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition disabled:opacity-70"
                        >
                            {isUpdating ? (
                                <>
                                    <FiLoader className="animate-spin inline mr-2" />
                                    Updating...
                                </>
                            ) : (
                                'Update Product'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Edit;