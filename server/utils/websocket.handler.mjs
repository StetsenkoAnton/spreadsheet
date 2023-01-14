import { SEVENTS } from "../../core/spreadsheet-events.js";
import DocumentController from "../controller/document.controller.mjs";

const documentController = new DocumentController();

function onFocusCell(socket, data, callback) {
  var result = documentController.addFocussedCell(data.tableName, data);

  if (result.success) {
    data.selectedList = documentController.getFocussedCell(data.tableName).data;
    socket.broadcast.emit(SEVENTS.CELL.FOCUSED, data);
  }

  callback(result);
}

async function onSaveCell(socket, data, callback) {
  var result = await documentController.updateDocument(data.tableName, data);
  
  if (result.success) {
    documentController.removeFocussedCell(data.tableName, data);
    data.selectedList = documentController.getFocussedCell(data.tableName).data;
    socket.broadcast.emit(SEVENTS.CELL.SAVED, data);
  }
 
  callback(result);
}

function onSaveDocument(socket, data, callback) {
  var result = documentController.saveDocument(data.tableName);

  if (result.success) {
    socket.emit(SEVENTS.DOCUMENT.SAVED, data);
  } 

  callback(result);
}

function registerEvents(io, socket) {
  socket.on(SEVENTS.CELL.FOCUS, (data, cb) => onFocusCell(socket, data, cb));
  socket.on(SEVENTS.CELL.SAVE, (data, cb) => onSaveCell(socket, data, cb));
  socket.on(SEVENTS.DOCUMENT.SAVE, (data, cb) => onSaveDocument(socket, data, cb));
}

export default registerEvents;
