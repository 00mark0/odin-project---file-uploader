import express from "express";
import {
  getUsers,
  deleteUser,
  getUserFolders,
  deleteFolder,
  deleteFile,
  getFilesInFolder,
} from "../controllers/AdminController.js";
import { isAuthenticated, isAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/users", isAuthenticated, isAdmin, getUsers);
router.delete("/users/:id", isAuthenticated, isAdmin, deleteUser);
router.get("/users/:id/folders", isAuthenticated, isAdmin, getUserFolders);
router.get("/folders/:id/files", isAuthenticated, isAdmin, getFilesInFolder);
router.delete("/folders/:id", isAuthenticated, isAdmin, deleteFolder);
router.delete("/files/:id", isAuthenticated, isAdmin, deleteFile);

export default router;
