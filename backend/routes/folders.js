import express from "express";
import { createFolder } from "../controllers/FolderController.js";
import { isAuthenticated } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, createFolder);

export default router;
