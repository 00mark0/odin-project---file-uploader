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
