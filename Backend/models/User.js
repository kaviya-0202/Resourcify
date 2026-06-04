const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    college: { type: String },
    department: { type: String, required: true },
    year: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "staff"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
