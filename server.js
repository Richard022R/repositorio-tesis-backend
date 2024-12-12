const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// Load environment variables
dotenv.config({ path: './config/config.env' });
// Connect to database
const connectDB = require('./config/db');
connectDB();
// Initialize express app
const app = express();
// Use morgan for logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan(':method :url :status :response-time ms'));
}
// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());
// Routes
const userRoutes = require('./routes/user');
const tesisRoutes = require('./routes/tesis');
app.use('/api/v1/', tesisRoutes)
app.use('/api/v1/', userRoutes);
// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});