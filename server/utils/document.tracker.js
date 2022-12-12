var DocumentTracker = function () {
  "use strict";
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
    if (documentName && userUID) {
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
    } else {
      throw new Error(
        `DocumentName: ${documentName} and UserUID: ${userUID} can not be null, undefined or empty string.`
      );
    }
  };

  // remove document user relation
  this.removeUser = (documentName, userUID) => {
    if (documentName && userUID) {
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
    } else {
      throw new Error(
        `DocumentName: ${documentName} and UserUID: ${userUID} can not be null, undefined or empty string.`
      );
    }
  };

  // get users for the document
  this.getUsers = (documentName) => {
    if (documentName) {
      if (this._documentUserMap.has(documentName)) {
        return this._documentUserMap.get(documentName);
      }

      return [];
    } else {
      throw new Error(
        `DocumentName: ${documentName} can not be null, undefined or empty string.`
      );
    }
  };

  /**
   * Keep documents in the map
   */

  // add document
  this.addDocument = (documentName, data) => {
    if (documentName && data) {
      if (!this._documentsMap.has(documentName)) {
        this._documentsMap.set(documentName, data || {});
      }
    } else {
      throw new Error(
        `DocumentName: ${documentName} can not be null, undefined or empty string.`
      );
    }
  };

  // remove document
  this.removeDocument = (documentName) => {
    if (documentName) {
      if (this._documentsMap.has(documentName)) {
        this._documentsMap.delete(documentName);
      }
    } else {
      throw new Error(
        `DocumentName: ${documentName} can not be null, undefined or empty string.`
      );
    }
  };

  // get users for the document
  this.getDocumentData = (documentName) => {
    if (documentName) {
      if (this._documentsMap.has(documentName)) {
        return this._documentsMap.get(documentName);
      }
    } else {
      throw new Error(
        `DocumentName: ${documentName} can not be null, undefined or empty string.`
      );
    }
  };

  // check if document exists
  this.hasDocument = (documentName) => {
    if (documentName) {
      return this._documentsMap.has(documentName);
    } else {
      throw new Error(
        `DocumentName: ${documentName} can not be null, undefined or empty string.`
      );
    }
  };

  this.updateDocument = (documentName, cellData) => {
    if (documentName && cellData) {
      if (this._documentsMap.has(documentName)) {
        const workbook = this._documentsMap.get(documentName);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        let cell = sheet["!data"][cellData.row][cellData.col] || {
          t: "s",
          v: undefined,
        };

        cell.v = cellData.value;

        sheet["!data"][cellData.row][cellData.col] = cell;

        workbook.Sheets[workbook.SheetNames[0]] = sheet;
        this._documentsMap.set(documentName, workbook);
      }
    } else {
      throw new Error(
        `DocumentName: ${documentName} and ${cellData} can not be null, undefined or empty string.`
      );
    }
  };

  /**
   * Tracking focussed cells for each document
   */

  // add focussed cells
  this.addFocussedCell = (documentName, cell) => {
    if (documentName && cell) {
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
    } else {
      throw new Error(
        `DocumentName: ${documentName} or focussedCell ${cell} can not be null, undefined or empty string.`
      );
    }
  };

  // remove tracked focussed cells document
  this.removeFocussedCell = (documentName, cell) => {
    if (documentName && cell) {
      if (this._documentFocusedCell.has(documentName)) {
        const focussedCells = this._documentFocusedCell.get(documentName);

        if (
          focussedCells.length &&
          focussedCells.find(
            (c) => c.row === cell.row && c.col === cell.col
          ) !== undefined
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
    } else {
      throw new Error(
        `DocumentName: ${documentName} or focussedCell ${cell} can not be null, undefined or empty string.`
      );
    }
  };

  // get focussed cell for the document
  this.getFocussedCell = (documentName) => {
    if (documentName) {
      if (this._documentFocusedCell.has(documentName)) {
        return this._documentFocusedCell.get(documentName);
      }

      return [];
    } else {
      throw new Error(
        `DocumentName: ${documentName} can not be null, undefined or empty string.`
      );
    }
  };
};

DocumentTracker.getInstance = () => {
  "use strict";
  return DocumentTracker._instance || new DocumentTracker();
};

export default DocumentTracker;
