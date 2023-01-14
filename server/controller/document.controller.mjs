import fs from "fs";
import { fileURLToPath } from "url";
import XLSX from "exceljs";

import { logger } from "../logger.mjs";
import envUtils from "../env-utils.mjs";
import DocumentTracker from "../utils/document.tracker.mjs";
import { adaptToArray } from "../utils/spreadsheet.adapter.mjs";
import { guard } from "../utils/guard.mjs";
import { error, success } from "../utils/controller.utils.mjs";
import { CONST } from "../../core/constant.js";

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
          (err, filenames) => {
            if (err !== null) {
              logger.error(`Unable to read directory: ${this._documentsFolderURL}`, err);
              reject(error(CONST.RESPONSE.CODE.SERVER_ERROR, err.message));
            }

            // skip files that are temporarily generated by system
            resolve(success(filenames.filter((f) => !f.name.startsWith("~$"))));
          }
        );
      } else {
        logger.error(`Directory ${this._documentsFolderURL} does not exist.`);
        reject(error(CONST.RESPONSE.CODE.NOT_FOUND, `Directory ${this._documentsFolderURL} does not exist.`));
      }
    });
  }

  // return first sheet of the workbook
  async getDocument(documentName, userUID) {
    if (!guard.string.isNotEmpty(userUID)) {
      logger.error(`Invalid user uid. ${userUID}`);
      return error(CONST.RESPONSE.CODE.BAD_REQUEST, `Invalid user uid. ${userUID}`);
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

          return success({
            name: documentName,
            sheetName: firstWorksheet.name,
            data: adaptToArray(firstWorksheet),
            users: this._docTracker.getUsers(documentName),
            // focused cells
            selectedList: this._docTracker.getFocussedCell(documentName),
          });
        } else {
          logger.error(
            `Document ${filePath} is empty and does not have any worksheets.`
          );
          return error(CONST.RESPONSE.CODE.FORBIDDEN, 
            `Document ${filePath} is empty and does not have any worksheets.`
          );
        }
      } else {
        logger.error(`File, ${documentName}, does not exist.`);
        return error(CONST.RESPONSE.CODE.NOT_FOUND, `File, ${documentName}, does not exist.`);
      }
    } else {
      logger.error(`Folder ${this._documentsFolderURL} does not exist.`);
      return error(CONST.RESPONSE.CODE.NOT_FOUND, `Folder ${this._documentsFolderURL} does not exist.`);
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

      try {
        await workbook.xlsx.writeFile(filePath);
        return success();
      } catch (ex) {
        logger.error(
          `Unable to save data to ${documentName}, document is busy.`,
          ex
        );

        return error(CONST.RESPONSE.CODE.FORBIDDEN, `Unable to save document: ${documentName} - ${ex.message}`);
      }
    } else {
      logger.error(
        `Something went wrong. Unable to get workbook from document tracker for the document - ${documentName}`
      );

      return error(CONST.RESPONSE.CODE.SERVER_ERROR, `Something went wrong. Unable to get workbook from document tracker for the document - ${documentName}`);
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
      return error(CONST.RESPONSE.CODE.BAD_REQUEST, `Document tracker does not contain record for the ${documentName}`);
    }
  }

  addFocussedCell(documentName, cellData) {
    if (this._nameIsNotNullOrEmpty(documentName, "Add Focussed Cell.")
     && this._valueIsObject(cellData, "Cell data cannot be null or undefined.")) {
      this._docTracker.addFocussedCell(documentName, cellData);
      return success();
    } else {
      return error(CONST.RESPONSE.CODE.BAD_REQUEST, 'Unable to add focused cell. Missing document name or cell data.');
    }
  }

  removeFocussedCell(documentName, cellData) {
    if (
      this._nameIsNotNullOrEmpty(documentName, "Remove Focussed Cell.")
      && this._valueIsObject(cellData, "Cell data cannot be null or undefined.")
    ) {
      this._docTracker.removeFocussedCell(documentName, cellData);
      return success();
    }
    return error(CONST.RESPONSE.CODE.BAD_REQUEST, "Document name or cell data is null or empty.");
  }

  getFocussedCell(documentName) {
    if (this._nameIsNotNullOrEmpty(documentName, "Get Focussed Cell")) {
      return success(this._docTracker.getFocussedCell(documentName));
    }

    return error(CONST.RESPONSE.CODE.BAD_REQUEST, "Document name is null or empty.");
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
    
    return false;
  }

  _valueIsObject(value, errorMessage = "") {
    if (guard.object.is(value)) {
      return true;
    }

    logger.error(`${errorMessage}, Value: ${value}`);
    return false;
  }
}
