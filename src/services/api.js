import { io } from "socket.io-client";
import { SEVENTS } from "../../core/spreadsheet-events";

const userID = Date.now();
console.log("userID", userID);
const serverRoot = "http://localhost:3000";
const serverPath = `${serverRoot}/api/v1/`;

const socket = io(serverRoot);
socket.on("connect", () => {
  console.log("connect", socket.id);
});

socket.on("disconnect", () => {
  alert("disconnect WS server");
});

export function streamGet(name, cb) {
  socket.on(name, (e) => {
    cb(e);
  });
}
export function subscribeFocusEv(cb) {
  console.log("FOCUS");
  streamGet(SEVENTS.CELL.FOCUS, cb);
}
export function subscribeUpdateEv(cb) {
  console.log("SAVE");
  streamGet(SEVENTS.CELL.SAVE, cb);
}
export function streamSend(name, body) {
  socket.emit(name, body);
}
export function streamSelectedCell(body) {
  console.log("streamSelectedCell");
  streamSend(SEVENTS.CELL.FOCUS, body);
}
export function streamUpdatedCell(body) {
  console.log("streamUpdatedCell");
  streamSend(SEVENTS.CELL.SAVE, body);
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
