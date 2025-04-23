import React, { useState } from "react";
import axios from "axios";
import { backendUrl} from '../App';

const categories = ["body", "neck", "inlay", "product"];

const UploadGallery = () => {
  const [imageFiles, setImageFiles] = useState([]);
  const [category, setCategory] = useState("body");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImageFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFiles || imageFiles.length === 0) {
      setMessage("Please select images to upload");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    Array.from(imageFiles).forEach((file, i) => {
      formData.append(`image${i + 1}`, file);
    });
    formData.append("category", category);

    try {
      const response = await axios.post(backendUrl + "/api/gallery/add", formData);
      setMessage("Images uploaded successfully!");
    } catch (error) {
      setMessage("Error uploading images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded-md text-black">
      <h2 className="text-xl font-bold mb-4">Upload Gallery Images</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <div>
          <label className="block font-medium">Select Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Choose Images:</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="mt-1 block w-full"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
    </div>
  );
};

export default UploadGallery;
