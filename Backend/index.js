const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const medicalDetails = require("./routes/doctorRoutes");
const studentRoutes = require("./routes/studentRoutes");
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
app.use('/api/student', studentRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
 