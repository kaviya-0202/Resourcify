const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const { Readable } = require("stream");
const Resource = require("../models/Resource");

const uploadResource = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { resourceName, resourceType, department, year, category, description } = req.body;

    // Upload buffer to GridFS manually
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    const filename = `${Date.now()}-${req.file.originalname}`;

    const uploadStream = bucket.openUploadStream(filename);

    const readable = new Readable();
    readable.push(req.file.buffer);
    readable.push(null);
    readable.pipe(uploadStream);

    uploadStream.on("error", () => {
      return res.status(500).json({ message: "File storage failed" });
    });

    uploadStream.on("finish", async () => {
      const resource = new Resource({
        resourceName,
        resourceType,
        department,
        year,
        category,
        description,
        fileId: uploadStream.id,
        filename,
        originalName: req.file.originalname,
        uploadedBy: req.user.id,
        uploaderName: req.user.name,
      });

      await resource.save();
      res.status(201).json({ message: "Resource uploaded successfully", resource });
    });

  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

const getResources = async (req, res) => {
  try {
    const { department, year, category, search } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (year) filter.year = year;
    if (category) filter.category = category;
    if (search) filter.resourceName = { $regex: search, $options: "i" };

    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    const downloadStream = bucket.openDownloadStream(resource.fileId);

    res.set("Content-Disposition", `attachment; filename="${resource.originalName}"`);
    res.set("Content-Type", "application/octet-stream");

    downloadStream.on("error", () => res.status(404).json({ message: "File not found" }));
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ message: "Download failed", error: err.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    await bucket.delete(resource.fileId);
    await Resource.findByIdAndDelete(req.params.id);

    res.json({ message: "Resource deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

module.exports = { uploadResource, getResources, downloadResource, deleteResource };