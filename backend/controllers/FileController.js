import { PrismaClient } from "@prisma/client";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import axios from "axios"; // Import axios

const prisma = new PrismaClient();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    resource_type: "auto", // Automatically detect the file type
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });

export const uploadFile = async (req, res, next) => {
  try {
    const { folderId } = req.body;
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File details:", file);

    let folderIdToUse = folderId ? parseInt(folderId) : null;

    if (!folderIdToUse) {
      // Create an "Untitled" folder if no folderId is provided
      const untitledFolder = await prisma.folder.create({
        data: {
          name: "Untitled",
          userId,
        },
      });
      folderIdToUse = untitledFolder.id;
    }

    const fileData = {
      name: file.originalname,
      size: file.size,
      url: file.path, // Use file.url instead of file.path
      userId,
      folderId: folderIdToUse,
    };

    const uploadedFile = await prisma.file.create({
      data: fileData,
    });

    res.json(uploadedFile);
  } catch (error) {
    console.error("Error uploading file:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getFile = async (req, res, next) => {
  try {
    const file = await prisma.file.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json(file);
  } catch (error) {
    console.error("Error retrieving file:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
