import { logger } from "../logger.mjs";
import { toEmptyString } from "./string.utils.js";

// normalize sheet object to 2 dimensional array
function _adaptToArray(spreadsheet) {
  let adaptedData = [];

  if (spreadsheet) {
    let maxCellIndex = 0;

    spreadsheet.eachRow(
      { includeEmpty: true },
      function adaptRow(row, rowNumber) {
        let rowData = {
          // make it zero based counting
          lineNumber: rowNumber - 1,
          row: [],
        };

        if (row.cellCount > maxCellIndex) {
          maxCellIndex = row.cellCount;
        }

        row.eachCell(
          { includeEmpty: true },
          function adaptCell(cell, colNumber) {
            rowData.row.push({
              value: toEmptyString(cell.value),
              column: colNumber - 1,
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
      for (let ci = rowData.row.length + 1; ci <= maxCellIndex; ci++) {
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
