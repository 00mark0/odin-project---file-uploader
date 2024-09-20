import express from "express";
import {
  getProfile,
  updateProfile,
  deleteAccount,
  searchFilesAndFolders,
  deleteFolder,
  deleteFile,
} from "../controllers/UserController.js";
import { isAuthenticated } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/profile", isAuthenticated, getProfile);
router.put("/profile", isAuthenticated, updateProfile);
router.delete("/profile", isAuthenticated, deleteAccount);
router.get("/search", isAuthenticated, searchFilesAndFolders);
router.delete("/folders/:id", isAuthenticated, deleteFolder);
router.delete("/files/:id", isAuthenticated, deleteFile);

export default router;
