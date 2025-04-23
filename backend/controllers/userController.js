import User from "../models/userModel.js";
import validator from "validator";
import bcryptjs from "bcryptjs";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.json({ success: false, message: 'Invalid token or user not found' });
      }
  
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
  
      user.password = hashedPassword;
      await user.save();
  
      res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: 'Invalid or expired token' });
    }
  };
  

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found with this email' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: '3xizGuitars <noreply@guitarparts.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>Hi ${user.name},</p>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetLink}" target="_blank">Reset Password</a>
        <p><strong>Note:</strong> This link expires in 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Reset link sent to your email' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Server error' });
  }
};


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