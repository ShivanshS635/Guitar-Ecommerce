import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized. Please login again." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.json({ success: false, message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded != process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Unauthorized" });
  }
};

export default adminAuth;
