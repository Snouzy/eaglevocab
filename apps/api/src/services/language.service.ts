import { languageRepository } from "../repositories/language.repository";
import { logger } from "../helpers/logger";

export const getAllLanguages = async () => {
  try {
    return await languageRepository.findAll();
  } catch (error) {
    logger.error("Get languages error", error);
    throw error;
  }
};

export const getLanguageById = async (id: string) => {
  try {
    return await languageRepository.findById(id);
  } catch (error) {
    logger.error("Get language by id error", error);
    throw error;
  }
};

export const getLanguageByCode = async (code: string) => {
  try {
    return await languageRepository.findByCode(code);
  } catch (error) {
    logger.error("Get language by code error", error);
    throw error;
  }
};
