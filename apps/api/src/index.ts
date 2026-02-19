import express, { json, urlencoded } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { toNodeHandler } from "better-auth/node";
import { env } from "./env";
import { corsConfig } from "./config/cors.config";
import { auth } from "./config/auth.config";
import { errorMiddleware } from "./middlewares/error.middleware";
import apiRoutes from "./routes/index";
import { logger } from "./helpers/logger";

const app: any = express();

app.use(helmet());
app.use(corsConfig);
app.use(morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } }));

app.use("/api/auth/*", toNodeHandler(auth));

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.use(errorMiddleware);

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});

export default app;
