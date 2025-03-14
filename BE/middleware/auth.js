import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization"); // Lấy token từ "Bearer <token>"
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied' });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = token_decode.id;
        // res.status(200).json(req.userId)
        next();
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid Token', error});
    }
};

export { authMiddleware };
