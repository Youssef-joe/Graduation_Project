const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const menuRoutes = require("./routes/menuRoutes.js");
const cors = require("cors");
const User = require("./models/userModel.js");

require("dotenv").config();

const PORT = process.env.PORT || 4000;
const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/bliss_rest";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Mount routes
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/menu", menuRoutes);

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit if unable to connect to database
  });
