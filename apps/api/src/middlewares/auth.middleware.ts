import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.config";
import { sendError } from "../helpers/api-response";
import { logger } from "../helpers/logger";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const headers = Object.fromEntries(
      Object.entries(req.headers).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[0] : value || "",
      ])
    );
    const session = await auth.api.getSession({ headers: headers as any });

    if (!session || !session.user) {
      sendError(res, "UNAUTHORIZED", "Unauthorized access", 401);
      return;
    }

    req.user = {
      id: session.user.id,
      name: session.user.name || "",
      email: session.user.email || "",
    };

    req.sessionData = {
      id: session.session.id,
      token: session.session.token,
      userId: session.session.userId,
      expiresAt: new Date(session.session.expiresAt),
    };

    next();
  } catch (error) {
    logger.error("Auth middleware error", error);
    sendError(res, "AUTH_ERROR", "Failed to authenticate", 500);
  }
};
