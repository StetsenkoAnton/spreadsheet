//import { readdirSync } from 'fs';
import { fileURLToPath } from "url"
import cors from "cors";
// import { createRequire } from 'node:module';
import { Server } from "socket.io";
import { default as http } from "http";
import { SEVENTS } from "../core/spreadsheet-events.js";
import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
import path from "path";
import express from "express";
import session from "cookie-session";
import crypto from "crypto";
import API_V_1 from "./api/index.router.mjs";

const isProd = process.env.NODE_ENV === 'production';
const rootFolder = '../dist';
/* load 'fs' for readFile and writeFile support */
XLSX.set_fs(fs);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexFile = new URL(`${rootFolder}/index.html`, import.meta.url);
const app = express();
const devCors = ["http://127.0.0.1:5173", "http://localhost:5173"];

app.set('trust proxy', 1) // trust first proxy

if (isProd)
{
  app.use(express.static(path.join(__dirname, `/${rootFolder}`)));
} else {
  app.use(cors({
      origin: devCors,
      credentials: true,
    })
  );
}

// todo: update with values from env
app.use(
  session({
    name: "spreadsheet-session",
    // todo: replace with env.SESSIOB_SECRET
    secret: "secretKeyForSession",
    secure: false,
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: "none",
  })
);

// // register session before api
app.use((req, res, next) => {
  console.log(req.session);
  // add session uid for user
  if (req.session.isNew && !req.session.sid) {
    req.session.sid = (req.session.sid || crypto.randomUUID());
  }

  next();
});

app.use("/api/v1", API_V_1);

app.get("*", (req, res) => {
  res.sendFile(fileURLToPath(indexFile));
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: devCors,
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("server connection");
  socket.on(SEVENTS.CELL.FOCUS, (msg) => {
    io.emit(SEVENTS.CELL.FOCUS, msg);
    console.log("message FOCUS: " + msg);
  });
  socket.on(SEVENTS.CELL.SAVE, (msg) => {
    io.emit(SEVENTS.CELL.SAVE, msg);
    console.log("message FOCUS: " + msg);
  });
});

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
