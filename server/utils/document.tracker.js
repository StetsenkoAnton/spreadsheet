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

  // add document user relation
  this.addUser = (documentName, userUID) => {
    if (documentName && userUID) {
      if (this._documentUserMap.has(documentName)) {
        const users = this._documentUserMap.get(documentName);

        if (users.indexOf(userUID) === -1) {
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

        if (users.indexOf(userUID) !== -1) {
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
};

DocumentTracker.getInstance = () => {
  "use strict";
  return DocumentTracker._instance || new DocumentTracker();
};

export default DocumentTracker;
