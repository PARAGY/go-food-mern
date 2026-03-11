import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "HaHa";

export const protect = (req, res, next) => {
  const token = req.header("auth-token") || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized as an admin" });
  }
};
