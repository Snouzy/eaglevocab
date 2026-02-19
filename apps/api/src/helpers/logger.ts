import winston from "winston";
import { env } from "../env";

const colors = {
  error: "\x1b[31m",
  warn: "\x1b[33m",
  info: "\x1b[36m",
  debug: "\x1b[35m",
  reset: "\x1b[0m",
};

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const levelUpper = level.toUpperCase();
    const color = colors[level as keyof typeof colors] || "";
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `${timestamp} ${color}[${levelUpper}]${colors.reset} ${message} ${metaStr}`;
  })
);

const transports: winston.transport[] = [
  new winston.transports.Console({ format }),
];

if (env.NODE_ENV === "production") {
  transports.push(
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" })
  );
}

export const logger = winston.createLogger({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  format,
  transports,
  exceptionHandlers: [
    new winston.transports.File({ filename: "exceptions.log" }),
  ],
});
