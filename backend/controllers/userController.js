import User from "../models/userModel.js";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Validate user credentials
        if (!email || !password) {
        return res.json({success: false , message: 'Please provide all required fields' });
        }
    
        // Check if user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
        return res.json({success: false , message: 'Invalid email or password' });
        }

        //unhash password
        const isMatch = await bcryptjs.compare(password, user.password);
    
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
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({success: false , message: 'User already exists' });
        }
        if (!validator.isEmail(email)) {
            return res.json({succes: false , message: 'Invalid email format' });
        }
        if(password.length < 8) {
            return res.json({success: false , message: 'Password must be at least 8 characters long' });
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password : hashedPassword,
        });
        const user = await newUser.save();
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