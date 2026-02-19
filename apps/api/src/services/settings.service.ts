import { UpdateSettingsInput } from "@eagle-vocab/types";
import { settingsRepository } from "../repositories/settings.repository";
import { AppError } from "../middlewares/error.middleware";
import { logger } from "../helpers/logger";

export const getSettings = async (userId: string) => {
  try {
    let settings = await settingsRepository.findByUserId(userId);

    if (!settings) {
      throw new AppError(
        "SETTINGS_NOT_FOUND",
        "User settings not initialized",
        404
      );
    }

    return settings;
  } catch (error) {
    logger.error("Get settings error", error);
    throw error;
  }
};

export const updateSettings = async (
  userId: string,
  input: UpdateSettingsInput
) => {
  try {
    let settings = await settingsRepository.findByUserId(userId);

    if (!settings) {
      throw new AppError(
        "SETTINGS_NOT_FOUND",
        "User settings not initialized",
        404
      );
    }

    const updatedSettings = await settingsRepository.update(userId, input);
    return updatedSettings;
  } catch (error) {
    logger.error("Update settings error", error);
    throw error;
  }
};
