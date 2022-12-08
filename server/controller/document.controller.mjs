import fs from "fs";
import { fileURLToPath } from "url";
import XLSX from "xlsx/xlsx.mjs";

import envUtils from "../env-utils.mjs";
import DocumentTracker from "../utils/document.tracker.js";
import { adaptToArray } from "../utils/spreadsheet.adapter.mjs";

export default class DocumentController {
  _documentsFolderURL = undefined;
  _docTracker = DocumentTracker.getInstance();

  constructor() {
    this._documentsFolderURL = envUtils.getDocumentsPath();
    this._docTracker = DocumentTracker.getInstance();
  }

  getDocuments() {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(this._documentsFolderURL)) {
        fs.readdir(
          this._documentsFolderURL,
          { encoding: "utf-8", withFileTypes: true },
          (err, filenames) => (err != null ? reject(err) : resolve(filenames))
        );
      } else {
        console.error(
          `Directory ${this._documentsFolderURL} does not exists.`
        );
      }
    });
  }

  // return first sheet of the workbook
  getDocument(documentName, userUID) {
    const filePath = fileURLToPath(
      new URL(
        this._documentsFolderURL.pathname + "/" + documentName,
        import.meta.url
      )
    );

    // root path exists
    if (documentName && fs.existsSync(this._documentsFolderURL)) {
      if (fs.existsSync(filePath)) {
        var workbook = undefined;

        // if document has been loaded by someone else return cached data
        if (this._docTracker.hasDocument(documentName)) {
          workbook = this._docTracker.getDocumentData(documentName);
        } else {
          workbook = XLSX.readFile(filePath, { dense: true });
          this._docTracker.addDocument(documentName, workbook);
        }

        this._docTracker.addUser(documentName, userUID);

        return {
          name: documentName,
          sheetName: workbook.SheetNames[0],
          data: adaptToArray(workbook.Sheets[workbook.SheetNames[0]]),
          users: this._docTracker.getUsers(documentName),
          // focused cells
          selectedList: this._docTracker.getFocussedCell(documentName)
        };
      } else {
        console.error(`File, ${documentName}, does not exist.`);
      }
    }
  }

  saveDocument(documentName) {
    if (documentName && this._docTracker.hasDocument(documentName)) {
      const workbook = this._docTracker.getDocumentData(documentName);

      if (workbook) {
        const filePath = fileURLToPath(
          new URL(
            this._documentsFolderURL.pathname + "/" + documentName,
            import.meta.url
          )
        );

        XLSX.writeFile(workbook, filePath);
      }
    }
  }

  updateDocument(documentName, cellData) {
    if (documentName && this._docTracker.hasDocument(documentName)) {
      this._docTracker.updateDocument(documentName, cellData);
    } else {
      // todo: reread file data???
      console.error("Unable to update document.");
    }
  }
}
