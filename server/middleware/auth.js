// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const auth = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRes = await db.query('SELECT id, name, surname, email, role, faculty FROM users WHERE id = $1', [decoded.id]);
    
    if (!userRes.rows[0]) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = userRes.rows[0];
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = auth;