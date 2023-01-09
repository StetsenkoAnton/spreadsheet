import { logger } from "../logger.mjs";
import { toEmptyString } from "./string.utils.js";

// adapt Sheetjs sheet object to 2 dimensional array
function _adaptToArray(spreadsheet) {
  let adaptedData = [];

  if (spreadsheet) {
    let maxCellIndex = 0;

    spreadsheet.eachRow(
      { includeEmpty: true },
      function adaptRow(row, rowNumber) {
        let rowData = {
          lineNumber: rowNumber,
          row: [],
        };

        if (row.cellCount > maxCellIndex) {
          maxCellIndex = row.cellCount;
        }

        row.eachCell(
          { includeEmpty: true },
          function adaptCell(cell, colNumber) {
            rowData.row.push({
              value: cell.value,
              column: colNumber,
              value: toEmptyString(cell.value),
              selected: false,
            });
          }
        );

        // push each row to returned array
        adaptedData.push(rowData);
      }
    );

    _normalizeDimensionalArray(adaptedData, maxCellIndex);
  } else {
    logger.error("Unable to read spreadsheet", spreadsheet);
  }

  return adaptedData;
}

// normalize two dimensional array to match subarray length - maxCellIndex
function _normalizeDimensionalArray(array, maxCellIndex) {
  for (let i = 0; i < array.length; i++) {
    let rowData = array[i];

    if (rowData.row.length < maxCellIndex) {
      for (let ci = rowData.row.length; ci < maxCellIndex; ci++) {
        rowData.row.push({
          value: "",
          column: ci,
          selected: false
        });
      }
    }
  }
}

export const adaptToArray = _adaptToArray;
