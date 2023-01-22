import { logger } from "../logger.mjs";
import {
  getFontFamily,
  getBgColor,
  argb2Hex,
  getBorder,
  getDecorationStyle
} from "./color.utils.js";
import { toEmptyString } from "./string.utils.mjs";

const POINTS_TO_PIXEL_MULTIPLIER = 1.33;

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
          height:  _rowHeightToPx(row.height),
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
              style: _styleToArgb(cell.style),
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

function _columnsToObject(columns) {
  if (columns && columns.length) {
    const columnsAsObject = [];

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      if (column.width !== undefined) {
        columnsAsObject.push({
          width: Math.round((column.width / 8.43 * 64)) + 32
        });
      } else {
        // default width
        columnsAsObject.push({
          width: 64
        });
      }
    }

    return columnsAsObject;
  }

  return [];
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
          selected: false,
        });
      }
    }
  }
}

/**
 * Replace any indexed or themed color with argb
 * @param {*} style
 */
function _styleToArgb(style) {
  if (!style) return null;
  return {
    color: argb2Hex(style.font?.color?.argb),
    fontFamily: getFontFamily(style.font?.name, style.font?.family),
    fontWeight: style.font?.bold ? 'bold' : null,
    fontStyle: style.font?.italic ? 'italic' : null,
    textDecorationStyle: getDecorationStyle(style.font?.underline),
    textDecorationLine: style.font?.underline ? 'underline' : null,
    backgroundColor: getBgColor(style.fill?.fgColor),
    textAlign: style?.alignment?.horizontal ?? null,
    verticalAlign: style?.alignment?.vertical ?? null,
    borderTop: getBorder(style?.border?.top),
    borderRight: getBorder(style?.border?.right),
    borderBottom: getBorder(style?.border?.bottom),
    borderLeft: getBorder(style?.border?.left),
  };
}

function _rowHeightToPx(height) {
  return height ? Math.round(height * POINTS_TO_PIXEL_MULTIPLIER) : null;
}

export const adaptToArray = _adaptToArray;
export const columnsToArray = _columnsToObject;
