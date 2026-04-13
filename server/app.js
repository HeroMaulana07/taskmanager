const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const originLink = ["https://localhost:5173/"];

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected with MongodDB ✅"))
  .catch(() => console.log("MongoDB error to connect❌"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
