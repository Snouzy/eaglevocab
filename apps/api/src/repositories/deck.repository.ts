import { prisma } from "@eagle-vocab/database";

export const deckRepository = {
  findById: async (id: string) => {
    return prisma.deck.findUnique({
      where: { id },
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
          orderBy: { position: "asc" },
        },
      },
    });
  },

  findByUserId: async (
    userId: string,
    options: { skip?: number; take?: number } = {}
  ) => {
    const { skip = 0, take = 20 } = options;

    return prisma.deck.findMany({
      where: { userId },
      skip,
      take,
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
      orderBy: { createdAt: "desc" },
    });
  },

  countByUserId: async (userId: string) => {
    return prisma.deck.count({ where: { userId } });
  },

  create: async (data: any, userId: string) => {
    return prisma.deck.create({
      data: {
        ...data,
        userId,
      },
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
    });
  },

  update: async (id: string, data: any) => {
    return prisma.deck.update({
      where: { id },
      data,
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
    });
  },

  delete: async (id: string) => {
    return prisma.deck.delete({
      where: { id },
    });
  },

  addCardToDeck: async (deckId: string, cardId: string, position?: number) => {
    const maxPosition = await prisma.deckCard.findFirst({
      where: { deckId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const newPosition = position ?? (maxPosition?.position ?? 0) + 1;

    return prisma.deckCard.create({
      data: {
        deckId,
        cardId,
        position: newPosition,
      },
    });
  },

  removeCardFromDeck: async (deckId: string, cardId: string) => {
    return prisma.deckCard.delete({
      where: {
        deckId_cardId: {
          deckId,
          cardId,
        },
      },
    });
  },
};
