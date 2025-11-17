const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ Otherwise check cookie (correct way)
    if (!token && req.cookies?.user) {
      let parsedUser;
      try {
        parsedUser = JSON.parse(req.cookies.user);  // parse cookie
      } catch (err) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid cookie format" });
      }

      token = parsedUser.token; // extract token properly
    }

    // 3️⃣ No token at all
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5️⃣ Attach user info
    req.user = decoded;

    next();
  } catch (error) {
    console.error("❌ Error in authenticate middleware:", error);
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
