const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token taqdim etilmagan' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token tekshirish xatosi:', error);
    return res.status(401).json({ message: 'Noto‘g‘ri yoki muddati tugagan token' });
  }
};

module.exports = authMiddleware;