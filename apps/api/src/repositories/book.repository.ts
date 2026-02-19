import { prisma } from "@eagle-vocab/database";

export const bookRepository = {
  findById: async (id: string) => {
    return prisma.book.findUnique({
      where: { id },
      include: {
        language: true,
        decks: {
          include: {
            cards: {
              include: {
                card: {
                  include: {
                    sourceLanguage: true,
                    targetLanguage: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  },

  findByUserId: async (
    userId: string,
    options: { skip?: number; take?: number } = {}
  ) => {
    const { skip = 0, take = 20 } = options;

    return prisma.book.findMany({
      where: { userId },
      skip,
      take,
      include: {
        language: true,
        decks: {
          include: {
            cards: {
              include: {
                card: {
                  include: {
                    sourceLanguage: true,
                    targetLanguage: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  countByUserId: async (userId: string) => {
    return prisma.book.count({ where: { userId } });
  },

  create: async (data: any, userId: string) => {
    return prisma.book.create({
      data: {
        ...data,
        userId,
      },
      include: {
        language: true,
        decks: {
          include: {
            cards: {
              include: {
                card: {
                  include: {
                    sourceLanguage: true,
                    targetLanguage: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  },

  update: async (id: string, data: any) => {
    return prisma.book.update({
      where: { id },
      data,
      include: {
        language: true,
        decks: {
          include: {
            cards: {
              include: {
                card: {
                  include: {
                    sourceLanguage: true,
                    targetLanguage: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  },

  delete: async (id: string) => {
    return prisma.book.delete({
      where: { id },
    });
  },
};
