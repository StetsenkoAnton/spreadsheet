//import { readdirSync } from 'fs';
import { fileURLToPath } from 'url'
// import { createRequire } from 'node:module';
import { Server } from "socket.io";
import { default as http } from "http";
import { SPREADSHEET_EVENTS } from '../core/spreadsheet-events.js';
import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
import express from "express";
import API_V_1 from "./api/index.router.mjs";

/* load 'fs' for readFile and writeFile support */
XLSX.set_fs(fs);

const indexFile = new URL('./html/index.html', import.meta.url);
const app = express();
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
  console.log("listening on *:3000");
});