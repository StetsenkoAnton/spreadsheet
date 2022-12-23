import { io } from "socket.io-client";
import { SEVENTS } from "../../core/spreadsheet-events";

const userID = Date.now();
console.log("userID", userID);
const serverRoot =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "";
const serverPath = `${serverRoot}/api/v1/`;

const socket = io(serverRoot);

export function streamGet(name, cb, fileName) {
  socket.on(name, (e) => {
    console.log("get", name, fileName, e);
    if (e.tableName === fileName) cb(e);
  });
}

export function unSubscribeEv(name) {
  socket.removeAllListeners(name);
}
export function subscribeFocusEv(cb, fileName) {
  streamGet(SEVENTS.CELL.FOCUSED, cb, fileName);
}
export function subscribeUpdateEv(cb, fileName) {
  streamGet(SEVENTS.CELL.SAVED, cb, fileName);
}
export function subscribeDocumentSavedEv(cb, fileName) {
  streamGet(SEVENTS.DOCUMENT.SAVED, cb, fileName);
}
export function subscribeServerEv(cb) {
  socket.on("connect", () => {
    console.log("connect", socket.id);
    cb(true);
  });

  socket.on("disconnect", () => {
    console.error("disconnect WS server");
    cb(false);
  });
}
export function streamSend(name, body) {
  console.log("send", name, body);
  socket.emit(name, body);
}
export function streamSelectedCell(body) {
  streamSend(SEVENTS.CELL.FOCUS, body);
}
export function streamUpdatedCell(body) {
  streamSend(SEVENTS.CELL.SAVE, body);
}
export function streamSaveFile(body) {
  streamSend(SEVENTS.DOCUMENT.SAVE, body);
}
function apiRequest(path) {
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(path, options)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      throw new Error(error);
    });
}
export function getAllFiles() {
  return apiRequest(`${serverPath}document`)
    .then((response) => response)
    .catch((error) => {
      throw new Error(error);
    });
}
export function getTable(name) {
  return apiRequest(`${serverPath}document/${name}`)
    .then((response) => response)
    .catch((error) => {
      throw new Error(error);
    });
}
