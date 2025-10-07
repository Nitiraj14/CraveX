import jwt from 'jsonwebtoken';
export const authmiddleware = (req, res, next) => { 
  const token = req.cookies.token; 
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }     
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // check what is actually inside
    req.user = { id: decoded.id }; // ensure it has id
    next();
  } catch (err) {
    console.error("JWT error:", err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};


//self verification needed for testing purpose
