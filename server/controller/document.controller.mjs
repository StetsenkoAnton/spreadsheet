import fs from "fs";
import { fileURLToPath } from "url";

import envUtils from "../env-utils.mjs";
import DocumentTracker from "../utils/document.tracker.js";
import { adaptToArray } from "../utils/spreadsheet.adapter.mjs";
import XLSX from "exceljs";

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
  async getDocument(documentName, userUID) {
    const filePath = fileURLToPath(
      new URL(
        this._documentsFolderURL.pathname + "/" + documentName,
        import.meta.url
      )
    );

    // root path exists
    if (documentName && fs.existsSync(this._documentsFolderURL)) {
      if (fs.existsSync(filePath)) {
        // if document has been loaded by someone else return cached data
        if (!this._docTracker.hasDocument(documentName)) {
          const newWorkbook = new XLSX.Workbook();
          await newWorkbook.xlsx.readFile(filePath);
          this._docTracker.addDocument(documentName, newWorkbook);
        }

        const workbook = this._docTracker.getDocumentData(documentName);

        if (workbook && workbook.worksheets.length) {
          this._docTracker.addUser(documentName, userUID);
          const firstWorksheet = workbook.worksheets[0];

          return {
            name: documentName,
            sheetName: firstWorksheet.name,
            data: adaptToArray(firstWorksheet),
            users: this._docTracker.getUsers(documentName),
            // focused cells
            selectedList: this._docTracker.getFocussedCell(documentName)
          };
        } else {
          console.log("Workbook does not have any worksheets");
        }
      } else {
        console.error(`File, ${documentName}, does not exist.`);
      }
    }
  }

  async saveDocument(documentName) {
    if (documentName && this._docTracker.hasDocument(documentName)) {
      const workbook = this._docTracker.getDocumentData(documentName);

      if (workbook) {
        const filePath = fileURLToPath(
          new URL(
            this._documentsFolderURL.pathname + "/" + documentName,
            import.meta.url
          )
        );

        return workbook.xlsx.writeFile(filePath);
      }
    }
  }

  async updateDocument(documentName, cellData) {
    if (documentName && this._docTracker.hasDocument(documentName)) {
      this._docTracker.updateDocument(documentName, cellData);
      return this.saveDocument(documentName);
    } else {
      // todo: reread file data???
      console.error("Unable to update document.");
    }
  }

  addFocussedCell(documentName, cellData) {
    if (documentName && cellData) {
      this._docTracker.addFocussedCell(documentName, cellData);
    } else {
      console.error("Unable to add Focussed Cell.");
    }
  }

  removeFocussedCell(documentName, cellData) {
    if (documentName && cellData) {
      this._docTracker.removeFocussedCell(documentName, cellData);
    } else {
      console.error("Unable to remove Focussed Cell.");
    }
  }

  getFocussedCell(documentName) {
    if (documentName) {
      return this._docTracker.getFocussedCell(documentName);
    } else {
      console.error("Unable to remove Focussed Cell.");
    }
  }
}
