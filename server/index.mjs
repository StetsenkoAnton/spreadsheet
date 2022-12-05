//import { readdirSync } from 'fs';
import { fileURLToPath } from "url"
import cors from "cors";
// import { createRequire } from 'node:module';
import { Server } from "socket.io";
import { default as http } from "http";
import { SPREADSHEET_EVENTS } from '../core/spreadsheet-events.js';
import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
import path from "path";
import express from "express";
import API_V_1 from "./api/index.router.mjs";

const isDev = true; // TODO configure from package.json

/* load 'fs' for readFile and writeFile support */
XLSX.set_fs(fs);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexFile = new URL('../dist/index.html', import.meta.url);
const app = express();
app.use(express.static(path.join(__dirname, '/../dist')));
if (isDev) {
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
  socket.on('chat message', (msg) => {
    io.emit('chat event send', { msg: msg, ev: SPREADSHEET_EVENTS.CELL.FOCUS });

    console.log('message: ' + msg);
  });
});

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
