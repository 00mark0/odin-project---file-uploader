import express from "express";
import { uploadFile, getFile } from "../controllers/FileController.js";
import { isAuthenticated } from "../middleware/AuthMiddleware.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    resource_type: "auto", // Automatically detect the file type
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });

router.post("/upload", isAuthenticated, upload.single("file"), uploadFile);
router.get("/:id", isAuthenticated, getFile);

export default router;
