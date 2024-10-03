import express from "express";
import { createFolder, getFolders } from "../controllers/FolderController.js";
import { isAuthenticated } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, createFolder);
router.get("/", isAuthenticated, getFolders);

export default router;
