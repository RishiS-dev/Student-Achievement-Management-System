// middlewares/auth.js
import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/loginpage");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach payload (role, email, etc.)
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.redirect("/loginpage");
  }
}

export function checkStudent(req, res, next) {
  if (req.user && req.user.role === "student") {
    return next();
  }
  return res.status(403).send("Forbidden: Students only");
}

export function checkStaff(req, res, next) {
  if (req.user && req.user.role === "staff") {
    return next();
  }
  return res.status(403).send("Forbidden: Staff only");
}
