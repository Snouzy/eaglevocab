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

app.use(
  cors({
    origin: [env.WEB_URL, env.APP_URL],
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
  })
);
app.use(morgan("combined", { stream: { write: (msg: string) => logger.info(msg.trim()) } }));

const authHandler = toNodeHandler(auth);
const allowedOrigins = [env.WEB_URL, env.APP_URL];

app.all("/api/auth/*splat", (req: any, res: any) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const originalWriteHead = res.writeHead.bind(res);
  res.writeHead = (statusCode: number, ...args: any[]) => {
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    return originalWriteHead(statusCode, ...args);
  };

  return authHandler(req, res);
});

app.use(json());
app.use(urlencoded({ extended: true }));
app.use("/api", apiRoutes);
app.use(errorMiddleware);

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});

export default app;
