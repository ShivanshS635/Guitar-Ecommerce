
import Product from '../models/productModel.js'
import { v2 as cloudinary } from "cloudinary";
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

// Function for add product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (image) => image !== undefined
    );

    let imageUrls = await Promise.all(
      images.map(async (image) => {
        const result = await cloudinary.uploader.upload(image.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      img: imageUrls,
      date: Date.now(),
    };

    const product = new Product(productData);
    await product.save();

    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};



// Function for list products
const listProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Function for remove product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Function for single product info
const singleProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Function for edit product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.json({ success: false, message: "Product not found" });

    const imageFields = ['image1', 'image2', 'image3', 'image4'];
    let newImageUrls = [];

    for (const field of imageFields) {
      if (req.files?.[field]?.[0]) {
        const uploaded = await uploadToCloudinary(
          req.files[field][0].buffer,
          req.files[field][0].originalname
        );
        newImageUrls.push(uploaded);
      } else if (req.body[`existingImage_${field}`]) {
        newImageUrls.push(req.body[`existingImage_${field}`]);
      }
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.images = newImageUrls;

    await product.save();
    res.json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


export { addProduct, listProducts, removeProduct, singleProduct, editProduct };
