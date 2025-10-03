// server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const lecturerRoutes = require('./routes/lecturer.routes'); // 🔹 NEW
const prlRoutes = require('./routes/prl.routes');           // 🔹 NEW
const plRoutes = require('./routes/pl.routes');             // 🔹 NEW

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'], // React dev server
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/lecturer', lecturerRoutes); // 🔹
app.use('/api/prl', prlRoutes);           // 🔹
app.use('/api/pl', plRoutes);             // 🔹

// Test route
app.get('/api', (req, res) => {
  res.json({ message: 'LUCT Reporting System API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});