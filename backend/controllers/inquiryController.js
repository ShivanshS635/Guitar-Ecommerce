import nodemailer from 'nodemailer';
import User from '../models/userModel.js';

// Email template for admin inquiry
const adminInquiryTemplate = (name, phone, description, service, senderEmail) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        .details { margin: 20px 0; }
        .detail-row { margin-bottom: 10px; }
        .label { font-weight: bold; color: #2c3e50; display: inline-block; width: 100px; }
        .footer { margin-top: 30px; font-size: 0.9em; color: #7f8c8d; border-top: 1px solid #eee; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>New Service Inquiry</h2>
    </div>
    
    <div class="details">
        <div class="detail-row">
            <span class="label">Service:</span>
            <span>${service}</span>
        </div>
        <div class="detail-row">
            <span class="label">From:</span>
            <span>${name}</span>
        </div>
        <div class="detail-row">
            <span class="label">Phone:</span>
            <span>${phone}</span>
        </div>
        <div class="detail-row">
            <span class="label">Email:</span>
            <span>${senderEmail}</span>
        </div>
        <div class="detail-row">
            <span class="label">Description:</span>
            <div style="margin-top: 5px; padding: 10px; background: #f9f9f9; border-radius: 4px;">
                ${description.replace(/\n/g, '<br>')}
            </div>
        </div>
    </div>
    
    <div class="footer">
        <p>This inquiry was submitted through your website. Reply directly to this email to contact ${name}.</p>
    </div>
</body>
</html>
`;

// Email template for user confirmation
const userConfirmationTemplate = (name, service) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { color: #2c3e50; text-align: center; }
        .logo { max-width: 150px; margin: 0 auto 20px; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; font-size: 0.9em; color: #7f8c8d; margin-top: 30px; }
        .button { 
            display: inline-block; padding: 10px 20px; background: #3498db; 
            color: white; text-decoration: none; border-radius: 4px; margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Thank You for Your Inquiry!</h2>
    </div>
    
    <div class="content">
        <p>Dear ${name},</p>
        
        <p>We've received your inquiry regarding <strong>${service}</strong> and wanted to let you know it's been forwarded to our team.</p>
        
        <p>Here's what happens next:</p>
        <ul>
            <li>Our team will review your request within 24 hours</li>
            <li>We'll contact you at the phone number or email you provided</li>
            <li>You'll receive a detailed response with next steps</li>
        </ul>
    </div>
    
    <div class="footer">
        <p>If you didn't submit this inquiry, please ignore this email.</p>
        <p>&copy; ${new Date().getFullYear()} 3xizGuitars. All rights reserved.</p>
    </div>
</body>
</html>
`;

export const sendInquiryMail = async (req, res) => {
  const { name, phone, description, service } = req.body;
  const userId = req.user?.userId;

  try {
    // Validate required environment variables
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_APP_PASSWORD) {
      console.error('Missing email credentials in environment variables');
      return res.status(500).json({ 
        success: false, 
        message: 'Server configuration error' 
      });
    }

    // Get user data
    const user = await User.findById(userId);
    const senderEmail = user?.email || req.body.email;
    
    // Validate we have required fields
    if (!name || !phone || !description || !service || !senderEmail) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_APP_PASSWORD,
      },
    });

    // 1. Send inquiry to admin
    const adminMailOptions = {
      from: `"${name}" <${process.env.ADMIN_EMAIL}>`,
      to: 'shivansh3375@gmail.com',
      replyTo: senderEmail,
      subject: `New Inquiry: ${service}`,
      html: adminInquiryTemplate(name, phone, description, service, senderEmail),
      text: `New Inquiry\n\nService: ${service}\nName: ${name}\nPhone: ${phone}\nEmail: ${senderEmail}\n\nDescription:\n${description}`
    };

    // 2. Send confirmation to user
    const userMailOptions = {
      from: `"3XIZGUITARS" <${process.env.ADMIN_EMAIL}>`,
      to: senderEmail,
      subject: `We've received your ${service} inquiry!`,
      html: userConfirmationTemplate(name, service),
      text: `Thank you for your inquiry!\n\nDear ${name},\n\nWe've received your inquiry regarding ${service} and wanted to let you know it's been forwarded to our team.\n\nWe'll contact you within 24 hours.\n\nThank you,\n3xizGuitars`
    };

    // Send both emails in parallel
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);
    
    res.json({ 
      success: true, 
      message: 'Your inquiry has been sent successfully. Please check your email for confirmation.' 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    let errorMessage = 'Failed to send inquiry';
    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed - please check email server settings';
    } else if (error.code === 'EENVELOPE') {
      errorMessage = 'Invalid email address';
    }

    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};