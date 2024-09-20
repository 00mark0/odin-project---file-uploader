import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";

const prisma = new PrismaClient();
const upload = multer({ dest: "uploads/" });

export const uploadFile = async (req, res, next) => {
  try {
    const { folderId } = req.body;
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

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
      url: file.path,
      userId,
      folderId: folderIdToUse,
    };

    const uploadedFile = await prisma.file.create({
      data: fileData,
    });

    res.json(uploadedFile);
  } catch (error) {
    next(error);
  }
};

export const getFile = async (req, res, next) => {
  try {
    const file = await prisma.file.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.json(file);
  } catch (error) {
    next(error);
  }
};
