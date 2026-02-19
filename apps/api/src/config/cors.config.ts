import cors from "cors";
import { env } from "../env";

export const corsConfig = cors({
  origin: env.WEB_URL,
  credentials: true,
  optionsSuccessStatus: 200,
});
