//import { readdirSync } from 'fs';
import { fileURLToPath } from "url";
import cors from "cors";
// import { createRequire } from 'node:module';
import { Server } from "socket.io";
import { default as http } from "http";
import * as fs from "fs";
import path from "path";
import express from "express";
import cookieSession from "cookie-session";
import crypto from "crypto";
import os from "os";
import API_V_1 from "./api/index.router.mjs";
import registerEvents from "./utils/websocket.handler.mjs";

const isProd = process.env.NODE_ENV === "production";
const rootFolder = "../dist";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const devCors = ["http://127.0.0.1:5173", "http://localhost:5173"];
const indexFile = new URL(`${rootFolder}/index.html`, import.meta.url);

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

function getIp() {
  const interfaces = os.networkInterfaces();
  const interfacesArr = Object.values(interfaces).flat();
  return interfacesArr.filter((el) => el.family === 'IPv4' && !el.internal).map((el) => el.address);
}

server.listen(3000, () => {
  const allIPs = ['localhost', ...getIp()];
  allIPs.forEach((ip) => {
    console.log(`listening on http://${ip}:3000`);
  })
});
