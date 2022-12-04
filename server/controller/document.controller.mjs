import fs from "fs";
import { fileURLToPath } from 'url'
import XLSX from "xlsx/xlsx.mjs";

import envUtils from "../env-utils.mjs";


export class DocumetController {
    _documentsFolderURL = undefined;

    constructor() {
        this._documentsFolderURL = envUtils.documentsPath();
    }

    getDocuments() {
        return new Promise((resolve, reject) => {
            
            if (fs.existsSync(this._documentsFolderURL)) {
                fs.readdir(this._documentsFolderURL, {encoding: 'utf-8', withFileTypes: true}, (err, filenames) => err != null ? reject(err) : resolve(filenames));
            } else {
                throw new Error(`Directory ${docPath} does not exists.`);
            }
        });
    }

    getDocument(documentName) {
        if (documentName && fs.existsSync(this._documentsFolderURL)) {
            const filePath =  fileURLToPath(new URL(this._documentsFolderURL.pathname + '/' + documentName, import.meta.url));

            if (fs.existsSync(filePath)) {
                var workbook = XLSX.readFile(filePath);
                return workbook;
            } else {
                throw new Error(`File, ${documentName}, does not exist.`);
            }
        }
    }

    getSpreedsheat(documentName, sheetName) {
        const document = this.getDocument(documentName);

        if (document.SheetNames.indexOf(sheetName) !== -1) {
            return document.Sheets[sheetName];
        }
    }
}