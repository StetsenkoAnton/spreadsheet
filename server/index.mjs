import { fileURLToPath } from "url";
import cors from "cors";
import { Server } from "socket.io";
import { default as http } from "http";
import pino from "pino-http";
import path from "path";
import express from "express";
import cookieSession from "cookie-session";
import crypto from "crypto";

import { initExpressLogger, logger } from "./logger.mjs";
import { getIp } from "./utils/osUtils.mjs";
import API_V_1 from "./api/index.router.mjs";
import registerEvents from "./utils/websocket.handler.mjs";

const isProd = process.env.NODE_ENV === "production";
const rootFolder = "../dist";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const devCors = ["http://127.0.0.1:5173", "http://localhost:5173"];
const indexFile = new URL(`${rootFolder}/index.html`, import.meta.url);

console.log(isProd);
if (isProd) {
  app.use(express.static(path.join(__dirname, `/${rootFolder}`)));

} else {
  app.use(
    cors({
      origin: devCors,
      credentials: true,
    })
  );
}

// use logger
if (!isProd) app.use(initExpressLogger(new pino()));

// todo: update with values from env
app.use(
  cookieSession({
    name: "spreadsheet-session",
    // todo: replace with env.SESSION_SECRET
    keys: ["secretKeyForSession"],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: false,
    sameSite: false,
    httpOnly: false,
  })
);

// trust proxy
app.set("trust proxy");

// register session before api
app.use((req, res, next) => {
  // add session uid for user
  if (req.session.isNew && !req.session.sid) {
    req.session.sid = req.session.sid || crypto.randomUUID();
  }

  next();
});

// use const for api version
app.use("/api/v1", API_V_1);
app.get("*", (req, res) => {
  res.sendFile(fileURLToPath(indexFile));
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: devCors,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  registerEvents(io, socket);
});

server.listen(3000, () => {
  const allIPs = ['localhost', ...getIp()];
  allIPs.forEach((ip) => {
    console.log(`listening on http://${ip}:3000`);
  });

  process.on('uncaughtException', (err) => {
    logger.error(err);
    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    logger.error(err);
    process.exit(1);
  });
});
