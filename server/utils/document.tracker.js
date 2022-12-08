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

  // add document user relation
  this.addUser = (documentName, userUID) => {
    if (documentName && userUID) {
      if (this._documentUserMap.has(documentName)) {
        const users = this._documentUserMap.get(documentName);

        if (users && users.indexOf(userUID) === -1) {
          users.push(userUID);
        }
      } else {
        // add document to map with the first user
        this._documentUserMap.set(documentName, [userUID]);
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
        sheet['!data'][cellData.row][cellData.col] = {t: 's', v: cellData.value };

        workbook.Sheets[workbook.SheetNames[0]] = sheet;
        this._documentUserMap.set(documentName, workbook);
      }
    } else {
      throw new Error(
        `DocumentName: ${documentName} and ${cellData} can not be null, undefined or empty string.`
      );
    }
  }
};

DocumentTracker.getInstance = () => {
  "use strict";
  return DocumentTracker._instance || new DocumentTracker();
};

export default DocumentTracker;
