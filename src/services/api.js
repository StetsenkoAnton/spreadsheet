import { io } from "socket.io-client";
import { SEVENTS } from "../../core/spreadsheet-events";

const userID = Date.now();
console.log("userID", userID);
const serverRoot = "http://localhost:3000";
const serverPath = `${serverRoot}/api/v1/`;

const socket = io(serverRoot);
socket.on("connect", () => {
  console.log("connect", socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", () => {
  console.log("disconnect", socket.id); // undefined
});

socket.on(SEVENTS.CELL.FOCUS, (e) => {
  console.log("FOCUS", e); // undefined
});

socket.on(SEVENTS.CELL.SAVE, (e) => {
  console.log("SAVE", e); // undefined
});
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
