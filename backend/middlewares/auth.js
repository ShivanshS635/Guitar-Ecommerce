import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: 'Not Authorized. Please login again.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.id };
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Invalid Token. Please login again.' });
  }
};

export default authUser;