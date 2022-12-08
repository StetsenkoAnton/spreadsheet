import { SEVENTS } from "../../core/spreadsheet-events.js";
import DocumentController from "../controller/document.controller.mjs";

function onFocusCell(socket, data) {
  socket.broadcast.emit(SEVENTS.CELL.FOCUSED, data);
}

function onSaveCell(socket, data) {
  const documentController = new DocumentController();
  // TODO: update
  documentController.updateDocument(data.tableName, data);

  socket.broadcast.emit(SEVENTS.CELL.SAVED, data);
}

function registerEvents(io, socket) {
  socket.on(SEVENTS.CELL.FOCUS, (data) => onFocusCell(socket, data));
  socket.on(SEVENTS.CELL.SAVE, (data) => onSaveCell(socket, data));
}

export default registerEvents;
