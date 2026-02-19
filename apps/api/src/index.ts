import express, { json, urlencoded } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { env } from "./env";
import { auth } from "./config/auth.config";
import { errorMiddleware } from "./middlewares/error.middleware";
import apiRoutes from "./routes/index";
import { logger } from "./helpers/logger";

const app: any = express();

app.use((_req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", env.WEB_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (_req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(helmet());
app.use(morgan("combined", { stream: { write: (msg: string) => logger.info(msg.trim()) } }));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.use(errorMiddleware);

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});

export default app;
