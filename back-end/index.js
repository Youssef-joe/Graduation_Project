const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const PORT = 4000;
const mongoURI = "mongodb://localhost:27017/bliss_rest";
const cors = require("cors");
const User = require("./models/userModel.js");

require("dotenv").config();

app.use(cors({
  origin: "http://localhost:3000", // Allow requests from the frontend
  credentials: true,
}));



app.use(express.json());

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});

mongoose
  .connect(mongoURI)
  .then(() => console.log("mongoDB is connected"))
  .catch((er) => console.log("Error : ", er.message ? er.message : er));

app.use("/api", userRoutes);
app.use("/api", adminRoutes);
