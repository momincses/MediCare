const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const medicalDetails = require("./routes/medicalDetails");
const cors = require("cors");

// Initialize app
const app = express();
const PORT = 5000;

// Connect to database
connectDB();

console.log("hello")

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api', medicalDetails);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
 