const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Student Task Tracker backend is running!"
    });
});

// Home route
app.get("/", (req, res) => {
    res.send("Student Task Tracker API is working!");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});