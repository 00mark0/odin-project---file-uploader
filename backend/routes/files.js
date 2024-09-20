import express from "express";
import multer from "multer";
import { uploadFile, getFile } from "../controllers/FileController.js";
import { isAuthenticated } from "../middleware/AuthMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", isAuthenticated, upload.single("file"), uploadFile);
router.get("/:id", isAuthenticated, getFile);

export default router;
