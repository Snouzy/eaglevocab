import { prisma } from "@eagle-vocab/database";

export const settingsRepository = {
  findByUserId: async (userId: string) => {
    return prisma.userSettings.findUnique({
      where: { userId },
      include: {
        nativeLanguage: true,
        learningLanguages: {
          include: {
            language: true,
          },
        },
      },
    });
  },

  create: async (data: any) => {
    return prisma.userSettings.create({
      data,
      include: {
        nativeLanguage: true,
        learningLanguages: {
          include: {
            language: true,
          },
        },
      },
    });
  },

  update: async (userId: string, data: any) => {
    return prisma.userSettings.update({
      where: { userId },
      data,
      include: {
        nativeLanguage: true,
        learningLanguages: {
          include: {
            language: true,
          },
        },
      },
    });
  },
};
