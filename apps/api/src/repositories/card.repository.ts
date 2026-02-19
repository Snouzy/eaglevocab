import { prisma } from "@eagle-vocab/database";

export const cardRepository = {
  findById: async (id: string) => {
    return prisma.card.findUnique({
      where: { id },
      include: {
        sourceLanguage: true,
        targetLanguage: true,
        decks: {
          include: { deck: true },
        },
      },
    });
  },

  findByUserId: async (
    userId: string,
    options: { skip?: number; take?: number; deckId?: string } = {}
  ) => {
    const { skip = 0, take = 20, deckId } = options;

    const where: any = { userId };
    if (deckId) {
      where.decks = {
        some: {
          deckId,
        },
      };
    }

    return prisma.card.findMany({
      where,
      skip,
      take,
      include: {
        sourceLanguage: true,
        targetLanguage: true,
        decks: {
          include: { deck: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  countByUserId: async (userId: string, deckId?: string) => {
    const where: any = { userId };
    if (deckId) {
      where.decks = {
        some: {
          deckId,
        },
      };
    }

    return prisma.card.count({ where });
  },

  create: async (
    data: any,
    userId: string
  ) => {
    const { deckId, ...cardData } = data;

    const card = await prisma.card.create({
      data: {
        ...cardData,
        userId,
      },
      include: {
        sourceLanguage: true,
        targetLanguage: true,
        decks: {
          include: { deck: true },
        },
      },
    });

    if (deckId) {
      await prisma.deckCard.create({
        data: {
          deckId,
          cardId: card.id,
        },
      });
    }

    return card;
  },

  update: async (id: string, data: any) => {
    return prisma.card.update({
      where: { id },
      data,
      include: {
        sourceLanguage: true,
        targetLanguage: true,
        decks: {
          include: { deck: true },
        },
      },
    });
  },

  delete: async (id: string) => {
    return prisma.card.delete({
      where: { id },
    });
  },
};
