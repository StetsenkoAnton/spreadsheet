import fs from "fs";
import { fileURLToPath } from "url";
import XLSX from "exceljs";

import { logger } from "../logger.mjs";
import envUtils from "../env-utils.mjs";
import DocumentTracker from "../utils/document.tracker.js";
import { adaptToArray } from "../utils/spreadsheet.adapter.mjs";
import { guard } from "../utils/guard.js";
import e from "cors";

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
        logger.error(`Directory ${this._documentsFolderURL} does not exists.`);
        throw new Error(
          `Directory ${this._documentsFolderURL} does not exists.`
        );
      }
    });
  }

  // return first sheet of the workbook
  async getDocument(documentName, userUID) {
    if (!guard.string.isNotEmpty(userUID)) {
      logger.error(`Invalid user uid. ${userUID}`);
      throw new Error(`Invalid user uid. ${userUID}`);
    }

    const filePath = fileURLToPath(
      new URL(
        this._documentsFolderURL.pathname + "/" + documentName,
        import.meta.url
      )
    );

    // root path exists
    // TODO: think about async
    if (
      this._nameIsNotNullOrEmpty(documentName, "Get Document.") &&
      fs.existsSync(this._documentsFolderURL)
    ) {
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
            selectedList: this._docTracker.getFocussedCell(documentName),
          };
        } else {
          logger.error(
            `Document ${filePath} is empty and does not have any worksheets.`
          );
          throw new Error(
            `Document ${filePath} is empty and does not have any worksheets.`
          );
        }
      } else {
        logger.error(`File, ${documentName}, does not exist.`);
        throw new Error(`File, ${documentName}, does not exist.`);
      }
    } else {
      logger.error(`Folder ${this._documentsFolderURL} does not exist.`);
      throw new Error(`Folder ${this._documentsFolderURL} does not exist.`);
    }
  }

  async saveDocument(documentName) {
    if (
      this._nameIsNotNullOrEmpty(documentName, "Save document.") &&
      this._docTracker.hasDocument(documentName)
    ) {
      const workbook = this._docTracker.getDocumentData(documentName);

      const filePath = fileURLToPath(
        new URL(
          this._documentsFolderURL.pathname + "/" + documentName,
          import.meta.url
        )
      );

      return workbook.xlsx.writeFile(filePath);
    } else {
      logger.error(
        `Something went wrong. Unable to get workbook from document tracker for the document - ${documentName}`
      );
      throw new Error(
        `Something went wrong. Unable to get workbook from document tracker for the document - ${documentName}`
      );
    }
  }

  async updateDocument(documentName, cellData) {
    if (
      this._nameIsNotNullOrEmpty(documentName, "Update Document") &&
      this._docTracker.hasDocument(documentName) &&
      this._valueIsObject(cellData, "Cell data cannot be null or undefined.")
    ) {
      this._docTracker.updateDocument(documentName, cellData);
      return this.saveDocument(documentName);
    } else {
      // todo: try to reload document and notify user about document change
      logger.error(
        `Document tracker does not contain record for the ${documentName}`
      );
    }
  }

  addFocussedCell(documentName, cellData) {
    if (this._nameIsNotNullOrEmpty(documentName, "Add Focussed Cell.")
     && this._valueIsObject(cellData, "Cell data cannot be null or undefined.")) {
      this._docTracker.addFocussedCell(documentName, cellData);
    } else {
      console.error("Unable to add Focussed Cell.");
    }
  }

  removeFocussedCell(documentName, cellData) {
    if (
      this._nameIsNotNullOrEmpty(documentName, "Remove Focussed Cell.")
      && this._valueIsObject(cellData, "Cell data cannot be null or undefined.")
    ) {
      this._docTracker.removeFocussedCell(documentName, cellData);
    }
  }

  getFocussedCell(documentName) {
    if (this._nameIsNotNullOrEmpty(documentName, "Get Focussed Cell")) {
      return this._docTracker.getFocussedCell(documentName);
    }
  }

  /**
   * Check if document name is not null, undefined or empty string
   * @param {String} documentName - document name
   * @param {String} action - controller action
   * @returns
   */
  _nameIsNotNullOrEmpty(documentName, action = "") {
    if (guard.string.isNotEmpty(documentName)) {
      return true;
    }
    logger.error(
      `${action} Document name cannot be null or empty string. Document: ${documentName}`
    );
    throw new Error(`${action} Document name cannot be null or empty string.`);
  }

  _valueIsObject(value, errorMessage = "") {
    if (guard.object.is(value)) {
      return true;
    }

    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}
