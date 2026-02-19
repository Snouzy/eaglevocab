import cors from "cors";
import { env } from "../env";

export const corsConfig = cors({
  origin: [env.WEB_URL, env.APP_URL],
  credentials: true,
  optionsSuccessStatus: 200,
});
