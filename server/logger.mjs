import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pino from "pino";

const __dirname = dirname(fileURLToPath(import.meta.url));

const level = (() => {
  const env = process.env.NODE_ENV || "development";
  return env === "development" ? "info" : "error";
})();

const logFile = (() => {
  return process.env.LOG_FOLDER || join(__dirname, "../tmp/error.log");
})();

const transport = pino.transport({
  targets: [
    {
      // to console for dev env
      level: level,
      target: "pino-pretty",
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: "yyyy-dd-mm, h:MM:ss TT",
        ignore: "pid,hostname",
        destination: 1,
      },
    },
    {
      // error - to file for prod
      level: level,
      target: "pino/file",
      options: {
        destination: logFile,
        mkdir: true,
      },
    },
  ],
});

/**
 * Add pino configuration to express logger
 * @param {*} pinoHttp 
 * @returns 
 */
export const initExpressLogger = (pinoHttp) => {
  // set custom logger for the http logger
  pinoHttp.logger = pino(transport);
  return pinoHttp;
};
/**
 * Get logger
 */
export const logger = pino(transport);
