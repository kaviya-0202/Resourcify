const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");

dotenv.config();

const app = express();

app.use(cors({
  origin: ["https://resourcify-pi.vercel.app", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/resource", resourceRoutes);

app.get("/", (req, res) => {
  res.send("Resourcify Backend Running 🚀");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
