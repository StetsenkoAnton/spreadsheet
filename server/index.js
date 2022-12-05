//import { readdirSync } from 'fs';
import { fileURLToPath } from 'url'
import { createRequire } from 'node:module';
import { Server } from "socket.io";
import { default as http } from "http";
import { SEVENTS } from '../core/spreadsheet-events.js';
import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";

/* load 'fs' for readFile and writeFile support */
XLSX.set_fs(fs);

const require = createRequire(import.meta.url);
const API_V_1 = require('./api/index.router.cjs');
const express = require("express");

// readdirSync(new URL('./', import.meta.url)).forEach((dirContent) => {
//   console.log(dirContent);
// });

const indexFile = new URL('./html/index.html', import.meta.url);
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use('/api/v1', API_V_1);

app.get("/", (req, res) => {
  res.sendFile(fileURLToPath(indexFile));
});

app.get("/xlsx", (req, res) => {
  var workbook = XLSX.readFile(fileURLToPath(new URL('../documents/TEST.xlsx', import.meta.url)));
  var worksheet = workbook.Sheets[workbook.SheetNames[0]];
  console.log(worksheet);
  res.json(worksheet);
});


io.on("connection", (socket) => {
  socket.on(SEVENTS.CELL.FOCUS, (msg) => {
    io.emit(SEVENTS.CELL.FOCUS, { msg: msg });
  });

  socket.on(SEVENTS.CELL.FOCUS_LOST, (msg) => {
    io.emit(SEVENTS.CELL.FOCUS_LOST, { msg: msg });
  });

  socket.on(SEVENTS.DOCUMENT.CONNECT, (msg) => {
    io.emit(SEVENTS.DOCUMENT.CONNECT, { msg: msg });
  });

  socket.on(SEVENTS.DOCUMENT.CONNECT, (msg) => {
    io.emit(SEVENTS.DOCUMENT.CONNECT, { msg: msg });
  });
  });  

server.listen(3000, () => {
  console.log("listening on *:3000");
});