import { logger } from "../logger.mjs";

var DocumentTracker = function () {
  ("use strict");
  if (DocumentTracker._instance) {
    // This allows the constructor to be called multiple times
    // and refer to the same instance. Another option is to
    // throw an error.
    return DocumentTracker._instance;
  }

  // initialize DocumentTracker
  DocumentTracker._instance = this;
  this._documentUserMap = new Map();
  this._documentsMap = new Map();
  this._documentFocusedCell = new Map();

  // add document user relation
  this.addUser = (documentName, userUID) => {
    if (this._documentUserMap.has(documentName)) {
      let users = this._documentUserMap.get(documentName);

      if (users && users.indexOf(userUID) === -1) {
        users.push(userUID);
        this._documentUserMap.set(documentName, users);
      }
    } else {
      var users = [];
      users.push(userUID);
      // add document to map with the first user
      this._documentUserMap.set(documentName, users);
    }
  };

  // remove document user relation
  this.removeUser = (documentName, userUID) => {
    if (this._documentUserMap.has(documentName)) {
      const users = this._documentUserMap.get(documentName);

      if (users && users.indexOf(userUID) !== -1) {
        this._documentUserMap.set(
          documentName,
          users.filter((uid) => uid !== userUID)
        );
      }
    }

    // remove document if not watched
    if (
      !this._documentUserMap.has(documentName) ||
      this._documentUserMap.get(documentName).length === 0
    ) {
      this._documentsMap.delete(documentName);
    }
  };

  // get users for the document
  this.getUsers = (documentName) => {
    if (this._documentUserMap.has(documentName)) {
      return this._documentUserMap.get(documentName);
    }

    return [];
  };

  /**
   * Keep documents in the map
   */

  // add document
  this.addDocument = (documentName, data) => {
    if (!this._documentsMap.has(documentName)) {
      this._documentsMap.set(documentName, data || {});
    }
  };

  // remove document
  this.removeDocument = (documentName) => {
    if (this._documentsMap.has(documentName)) {
      this._documentsMap.delete(documentName);
    }
  };

  // get users for the document
  this.getDocumentData = (documentName) => {
    if (this._documentsMap.has(documentName)) {
      return this._documentsMap.get(documentName);
    }
  };

  // check if document exists
  this.hasDocument = (documentName) => {
    return this._documentsMap.has(documentName);
  };

  this.updateDocument = (documentName, cellData) => {
    if (this._documentsMap.has(documentName)) {
      const workbook = this._documentsMap.get(documentName);
      const sheet = workbook.worksheets[0];
      const row = sheet.getRow(cellData.row);
      const col = row.getCell(cellData.col);

      col.value = cellData.value;
    } else {
      logger.error(
        `Unable to update document. Document tracker misses such record. ${documentName}`
      );
    }
  };

  /**
   * Tracking focussed cells for each document
   */

  // add focussed cells
  this.addFocussedCell = (documentName, cell) => {
    if (this._documentFocusedCell.has(documentName)) {
      let cells = this._documentFocusedCell.get(documentName);
      cells.push({
        row: cell.row,
        col: cell.col,
      });

      this._documentFocusedCell.set(documentName, cells);
    } else {
      let cells = [];
      cells.push({
        row: cell.row,
        col: cell.col,
      });
      this._documentFocusedCell.set(documentName, cells);
    }
  };

  // remove tracked focussed cells document
  this.removeFocussedCell = (documentName, cell) => {
    if (this._documentFocusedCell.has(documentName)) {
      const focussedCells = this._documentFocusedCell.get(documentName);

      if (
        focussedCells.length &&
        focussedCells.find((c) => c.row === cell.row && c.col === cell.col) !==
          undefined
      ) {
        var tmpCells = focussedCells.filter(
          (c) => c.row !== cell.row && c.col !== cell.col
        );

        if (tmpCells.length === 0) {
          this._documentFocusedCell.delete(documentName);
        } else {
          this._documentFocusedCell.set(documentName, tmpCells);
        }
      }
    }
  };

  // get focussed cell for the document
  this.getFocussedCell = (documentName) => {
    if (this._documentFocusedCell.has(documentName)) {
      return this._documentFocusedCell.get(documentName);
    }

    return [];
  };
};

DocumentTracker.getInstance = () => {
  "use strict";
  return DocumentTracker._instance || new DocumentTracker();
};

export default DocumentTracker;
