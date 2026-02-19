import { Request, Response, NextFunction } from "express";
import { UpdateSettingsInput } from "@eagle-vocab/types";
import * as settingsService from "../services/settings.service";
import { sendSuccess, sendError } from "../helpers/api-response";
import { logger } from "../helpers/logger";

export const getSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const settings = await settingsService.getSettings(userId);
    sendSuccess(res, settings);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const input = req.body as UpdateSettingsInput;

    const settings = await settingsService.updateSettings(userId, input);
    sendSuccess(res, settings, "Settings updated successfully");
  } catch (error) {
    next(error);
  }
};
