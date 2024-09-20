import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        folders: {
          include: { files: true },
        },
        files: true,
      },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { email, oldPassword, newPassword, confirmNewPassword, username } =
      req.body;
    const data = {};

    if (email) data.email = email;

    if (oldPassword || newPassword || confirmNewPassword) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || !bcrypt.compareSync(oldPassword, user.password)) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "New passwords do not match" });
      }
      data.password = bcrypt.hashSync(newPassword, 10);
    }

    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: "Username is already taken" });
      }
      data.username = username;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await prisma.file.deleteMany({ where: { userId } });
    await prisma.folder.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const searchFilesAndFolders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { search } = req.query;
    const folders = await prisma.folder.findMany({
      where: {
        userId,
        name: { contains: search, mode: "insensitive" },
      },
      include: { files: true },
    });
    const files = await prisma.file.findMany({
      where: {
        userId,
        name: { contains: search, mode: "insensitive" },
      },
    });
    res.json({ folders, files });
  } catch (error) {
    next(error);
  }
};

export const deleteFolder = async (req, res, next) => {
  try {
    const folderId = parseInt(req.params.id);
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (folder.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.file.deleteMany({ where: { folderId } });
    await prisma.folder.delete({ where: { id: folderId } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const fileId = parseInt(req.params.id);
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (file.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.file.delete({ where: { id: fileId } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
