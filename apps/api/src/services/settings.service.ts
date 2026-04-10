import { UpdateSettingsInput } from "@eagle-vocab/types";
import { settingsRepository } from "../repositories/settings.repository";
import { AppError } from "../middlewares/error.middleware";
import { logger } from "../helpers/logger";
import { prisma } from "@eagle-vocab/database";

async function ensureSettings(userId: string) {
  let settings = await settingsRepository.findByUserId(userId);

  if (!settings) {
    const defaultLanguage = await prisma.language.findUnique({
      where: { code: "en" },
    });

    if (!defaultLanguage) {
      throw new Error("Default language (en) not found in database");
    }

    settings = await settingsRepository.create({
      userId,
      nativeLanguageId: defaultLanguage.id,
    });
  }

  return settings;
}

export const getSettings = async (userId: string) => {
  try {
    return await ensureSettings(userId);
  } catch (error) {
    logger.error("Get settings error", error);
    throw error;
  }
};

async function resolveLanguageId(idOrCode: string) {
  const language =
    (await prisma.language.findUnique({ where: { id: idOrCode } })) ??
    (await prisma.language.findUnique({ where: { code: idOrCode } }));

  if (!language) {
    throw new AppError("LANGUAGE_NOT_FOUND", `Language "${idOrCode}" not found`, 400);
  }

  return language.id;
}

export const updateSettings = async (
  userId: string,
  input: UpdateSettingsInput
) => {
  try {
    await ensureSettings(userId);

    const data: Record<string, unknown> = { ...input };
    if (data.nativeLanguageId) {
      data.nativeLanguageId = await resolveLanguageId(data.nativeLanguageId);
    }

    const updatedSettings = await settingsRepository.update(userId, data);
    return updatedSettings;
  } catch (error) {
    logger.error("Update settings error", error);
    throw error;
  }
};
