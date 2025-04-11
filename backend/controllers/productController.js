import {v2 as cloudinary} from 'cloudinary';
import Product from '../models/productModel.js';

//function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter(image => image !== undefined);

        let imageUrls = await Promise.all(images.map(async (image) => {
            const result = await cloudinary.uploader.upload(image.path, { resource_type: 'image'});
            return result.secure_url;
        }));

        const productData = {
            name,
            description,
            price : Number(price),
            category,
            img: imageUrls,
            date: Date.now(),
        };

        const product = new Product(productData);
        await product.save();

        res.json({success: true, message: "Product added successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }    
}

//function for list products
const listProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({success: true, products});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//finction for remove product
const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.json({success: false, message: "Product not found"});
        }
        res.json({success: true, message: "Product removed successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//function for single product info
const singleProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        if (!product) {
            return res.json({success: false, message: "Product not found"});
        }
        res.json({success: true, product});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//function for edit product
const editProduct = async (req, res) => {
    try {
        const { id, name, description, price, category } = req.body;
        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        const product = await Product.findById(id);
        if (!product) {
            return res.json({success: false, message: "Product not found"});
        }

        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = Number(price);
        if (category) product.category = category;

        const images = [image1, image2, image3, image4].filter(image => image !== undefined);
        if (images.length > 0) {
            const imageUrls = await Promise.all(images.map(async (image) => {
                const result = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
                return result.secure_url;
            }));
            product.img = imageUrls;
        }

        await product.save();

        res.json({success: true, message: "Product updated successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

export { addProduct, listProducts, removeProduct, singleProduct, editProduct };