import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    console.log("Decoded JWT:", decoded); // 🧪 Log the decoded payload

    req.user = decoded; // Attach decoded info to request
    next(); // Proceed to the next middleware or route
  });
};
