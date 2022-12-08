import fs from "fs";
import { fileURLToPath } from "url";
import XLSX from "xlsx/xlsx.mjs";

import envUtils from "../env-utils.mjs";
import DocumentTracker from "../utils/document.tracker.js";
import { adaptToArray } from "../utils/spreadsheet.adapter.mjs";

export default class DocumentController {
  _documentsFolderURL = undefined;

  constructor() {
    this._documentsFolderURL = envUtils.getDocumentsPath();
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
    const docTracker = DocumentTracker.getInstance();

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
        if (docTracker.hasDocument(documentName)) {
          workbook = docTracker.getDocumentData(documentName);
        } else {
          workbook = XLSX.readFile(filePath, { dense: true });
          docTracker.addDocument(documentName, workbook);
        }

        docTracker.addUser(documentName, userUID);

        return {
          name: documentName,
          sheetName: workbook.SheetNames[0],
          data: adaptToArray(workbook.Sheets[workbook.SheetNames[0]]),
          users: docTracker.getUsers(documentName),
        };
      } else {
        console.error(`File, ${documentName}, does not exist.`);
      }
    }
  }

  updateDocument(documentName, cellData) {
    const docTracker = DocumentTracker.getInstance();

    if (documentName && docTracker.hasDocument(documentName)) {
      docTracker.updateDocument(documentName, cellData);
    } else {
      console.error("Unable to update document.");
    }
  }
}
