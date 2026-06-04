const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    resourceName: { type: String, required: true },
    resourceType: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uploaderName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
