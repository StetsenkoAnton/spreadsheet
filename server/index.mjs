//import { readdirSync } from 'fs';
import { fileURLToPath } from "url"
import cors from "cors";
// import { createRequire } from 'node:module';
import { Server } from "socket.io";
import { default as http } from "http";
import { SEVENTS } from '../core/spreadsheet-events.js';
import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
import path from "path";
import express from "express";
import API_V_1 from "./api/index.router.mjs";

const isProd = process.env.NODE_ENV === 'production';
const rootFolder = '../dist';
/* load 'fs' for readFile and writeFile support */
XLSX.set_fs(fs);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexFile = new URL(`${rootFolder}/index.html`, import.meta.url);
const app = express();

if (isProd) app.use(express.static(path.join(__dirname, `/${rootFolder}`)));
else {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
}

const server = http.createServer(app);
const io = new Server(server);

app.use('/api/v1', API_V_1);

app.get("/", (req, res) => {
  res.sendFile(fileURLToPath(indexFile));
});

io.on("connection", (socket) => {
  console.log("server connection");
  socket.on(SEVENTS.CELL.FOCUS, (msg) => {
    io.emit(SEVENTS.CELL.FOCUS, msg);
    console.log('message FOCUS: ' + msg);
  });
  socket.on(SEVENTS.CELL.SAVE, (msg) => {
    io.emit(SEVENTS.CELL.SAVE, msg);
    console.log('message FOCUS: ' + msg);
  });
});

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
