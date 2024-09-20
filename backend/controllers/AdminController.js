import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const users = await prisma.user.findMany({
      where: search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { username: { contains: search, mode: "insensitive" } },
              { id: isNaN(parseInt(search)) ? undefined : parseInt(search) },
            ],
          }
        : {},
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    await prisma.file.deleteMany({ where: { userId } });
    await prisma.folder.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const getUserFolders = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const folders = await prisma.folder.findMany({
      where: { userId },
      include: { files: true },
    });
    res.json(folders);
  } catch (error) {
    next(error);
  }
};

export const deleteFolder = async (req, res, next) => {
  try {
    const folderId = parseInt(req.params.id);
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
    await prisma.file.delete({ where: { id: fileId } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
