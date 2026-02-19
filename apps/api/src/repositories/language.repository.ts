import { prisma } from "@eagle-vocab/database";

export const languageRepository = {
  findAll: async () => {
    return prisma.language.findMany({
      orderBy: { name: "asc" },
    });
  },

  findById: async (id: string) => {
    return prisma.language.findUnique({
      where: { id },
    });
  },

  findByCode: async (code: string) => {
    return prisma.language.findUnique({
      where: { code },
    });
  },
};
