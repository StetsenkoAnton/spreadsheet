import { SEVENTS } from "../../core/spreadsheet-events.js";
import DocumentController from "../controller/document.controller.mjs";

const documentController = new DocumentController();

function onFocusCell(socket, data) {
  documentController.addFocussedCell(data.tableName, data);
  socket.broadcast.emit(SEVENTS.CELL.FOCUSED, data);
}

function onSaveCell(socket, data) {
  // TODO: update
  documentController.updateDocument(data.tableName, data);
  documentController.removeFocussedCell(data.tableName, data);
  socket.broadcast.emit(SEVENTS.CELL.SAVED, data);
}

function registerEvents(io, socket) {
  socket.on(SEVENTS.CELL.FOCUS, (data) => onFocusCell(socket, data));
  socket.on(SEVENTS.CELL.SAVE, (data) => onSaveCell(socket, data));
}

export default registerEvents;
