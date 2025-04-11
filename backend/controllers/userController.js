import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import e from "express";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Validate user credentials
        if (!email || !password) {
        return res.josn({success: false , message: 'Please provide all required fields' });
        }
    
        // Check if user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
        return res.json({succes: false , message: 'Invalid email or password' });
        }

        //unhash password
        const isMatch = await bcrypt.compare(password, user.password);
    
        // Check if password matches
        if (!isMatch) {
        return res.json({success:false , message: 'Invalid email or password' });
        }
        else{
            // Generate JWT token
            const token = createToken(user._id);
            res.json({success: true , token});
        }
    } catch (error) {
        console.log(error)
        res.json({succes: false , message: 'Server error' });
    }
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Validate user input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
    
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({success: false , message: 'User already exists' });
        }

        //validate email format
        if (!validator.isEmail(email)) {
            return res.json({succes: false , message: 'Invalid email format' });
        }
        // Validate password strength
        if(password.length < 8) {
            return res.json({success: false , message: 'Password must be at least 8 characters long' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        // Create new user
        const newUser = new User({
            name,
            email,
            password : hashedPassword,
        });
    
        // Save user to the database
        const user = await newUser.save();
    
        // Generate JWT token
        const token = createToken(user._id);
    
        res.json({success : true ,token});
    } catch (error) {
        console.log(error);
        res.json({success : false , message: error.message });
    }
}

//route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password , process.env.JWT_SECRET);
            res.json({success: true , token});
        }
        else {
            res.json({success: false , message: 'Invalid email or password' });
        }
    } catch (error) {
        console.log(error);
        res.json({success: false , message: 'Server error' });
    }
}

export { loginUser, registerUser , adminLogin };