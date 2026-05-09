const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'travelapp_secret_2024';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

const vendorMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'vendor') return res.status(403).json({ error: 'Vendor access only' });
    next();
  });
};

const customerMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'customer') return res.status(403).json({ error: 'Customer access only' });
    next();
  });
};

module.exports = { authMiddleware, vendorMiddleware, customerMiddleware, JWT_SECRET };
