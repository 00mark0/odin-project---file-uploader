import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import fileRoutes from "./routes/files.js";
import folderRoutes from "./routes/folders.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import { errorHandler } from "./middleware/ErrorHandler.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
