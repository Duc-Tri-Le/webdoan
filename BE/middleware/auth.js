import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization"); 
  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = token_decode.id;
    req.userRole =token_decode.role
    // res.status(200).json(req.userId)
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Token", error });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
      if (!roles.includes(req.userRole)) {
          return res.status(403).json({ success: false, message: "Không có quyền truy cập!" });
      }
      next();
  };
};
export { authMiddleware, authorizeRoles };
