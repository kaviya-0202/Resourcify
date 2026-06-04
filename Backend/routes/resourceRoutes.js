const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const { uploadResource, getResources, downloadResource, deleteResource } = require("../controllers/resourceController");

// Use memory storage instead of GridFS storage engine
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", protect, upload.single("file"), uploadResource);
router.get("/", protect, getResources);
router.get("/download/:id", protect, downloadResource);
router.delete("/:id", protect, deleteResource);

module.exports = router;