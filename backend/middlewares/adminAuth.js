import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    const {token} = req.headers;
    if (!token) {
        return res.json({success : false , message: 'Unauthorized'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded != process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({success : false , message: 'Unauthorized'});
        }
        next();
    } catch (error) {
        console.log(error);
        res.json({success : false , message: 'Unauthorized'});
    }
}

export default adminAuth;