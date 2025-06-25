const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const topics = require("./routes/topics");
const experiments = require("./routes/experiments");
const modes = require("./routes/modes");
const teamMember = require("./routes/teamMember");
const contactMessage = require("./routes/contactMessage");

const app = express();
app.use(
  cors({
    origin: [
      "https://localhost:8081",
      "http://localhost:8081",
      "http://localhost:3000",
    ],
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Hardcoded admin credentials
const adminCredentials = {
  username: "admin",
  password: bcrypt.hashSync("password", 10),
};

// Admin login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (
    username === adminCredentials.username &&
    bcrypt.compareSync(password, adminCredentials.password)
  ) {
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || "your-secret-key",
      {
        expiresIn: "30d",
      }
    );
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// Serve static files from the frontend directory
app.use("/frontend", express.static(path.join(__dirname, "../frontend")));

// Specific route for experiment files
app.get(
  "/frontend/experiments/:category/:experiment/:mode/index.html",
  (req, res) => {
    const { category, experiment, mode } = req.params;
    const filePath = path.join(
      __dirname,
      "..",
      "frontend",
      "experiments",
      category,
      experiment,
      mode,
      "index.html"
    );

    console.log("Attempting to serve experiment file:", filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error("File not found:", filePath);
      return res.status(404).send("File not found");
    }

    // Set CORS headers
    res.set("Access-Control-Allow-Origin", "*");

    // Send the file
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error sending file");
      }
    });
  }
);

// Routes
app.use("/api/topics", topics);
app.use("/api/experiments", experiments);
app.use("/api/modes", modes);
app.use("/api/team-members", teamMember);
app.use("/api/contact-messages", contactMessage);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
