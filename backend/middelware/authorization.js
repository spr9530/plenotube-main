const jwt = require("jsonwebtoken");

exports.authenticate = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ If no header token, check cookie
    else if (req.cookies?.user?.token) {
      token = req.cookies.user.token;
    }

    // 3️⃣ If no token found anywhere
    if (!token) {
      return res.status(401).json({ message: "No token provided", success: false });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5️⃣ Attach user info from token to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error in authenticate middleware:", error);
    return res.status(403).json({ message: "Invalid or expired token", success: false });
  }
};
