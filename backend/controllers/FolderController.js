import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createFolder = async (req, res, next) => {
  try {
    const folder = await prisma.folder.create({
      data: {
        name: req.body.name,
        userId: req.user.id,
      },
    });
    res.json(folder);
  } catch (error) {
    next(error);
  }
};


export const getFolders = async (req, res, next) => {
  try {
    const folders = await prisma.folder.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        files: true, // Include files in the response
      },
    });
    res.json(folders);
  } catch (error) {
    next(error);
  }
};