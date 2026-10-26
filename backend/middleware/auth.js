const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Cast to a real ObjectId here, once, so every downstream use — including
    // aggregate() pipelines, which don't auto-cast strings like find() does — works correctly.
    req.userId = new mongoose.Types.ObjectId(decoded.userId);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = requireAuth;
