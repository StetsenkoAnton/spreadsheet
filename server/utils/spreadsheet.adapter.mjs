import { logger } from "../logger.mjs";
import { indexToColor, themeToColor, tintToColor } from "./color.utils.js";
import { toEmptyString } from "./string.utils.mjs";

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
  if (style) {
    if (style.font && style.font.color) {
      if (style.font.color.theme !== undefined) {
        if (style.font.color.tint !== undefined) {
          style.font.color.argb = tintToColor(themeToColor(style.font.color.theme), style.font.color.tint);
        } else {
          style.font.color.argb = themeToColor(style.font.color.theme);
        }
      }

      if (style.font.color.indexed !== undefined) {
        style.font.color.argb = indexToColor(style.font.color.indexed);
      }
    }

    if (style.border) {
      if (style.border.left && style.border.left.color) {
        if (style.border.left.color.indexed !== undefined) {
          style.border.left.color.argb = indexToColor(
            style.border.left.color.indexed
          );
        }

        if (style.border.left.color.theme !== undefined) {
          if (style.border.left.color.tint !== undefined) {
            style.border.left.color.argb = tintToColor(themeToColor(
              style.border.left.color.theme
            ), style.border.left.color.tint);
          } else {
            style.border.left.color.argb = themeToColor(
              style.border.left.color.theme
            );
          }
        }
      }

      if (style.border.right && style.border.right.color) {
        if (style.border.right.color.indexed !== undefined) {
          style.border.right.color.argb = indexToColor(
            style.border.right.color.indexed
          );
        }

        if (style.border.right.color.theme !== undefined) {
          if (style.border.right.color.tint !== undefined) {
            style.border.right.color.argb = tintToColor(themeToColor(
              style.border.right.color.theme
            ), style.border.right.color.tint);
          } else {
            style.border.right.color.argb = themeToColor(
              style.border.right.color.theme
            );
          }
        }
      }

      if (style.border.top && style.border.top.color) {
        if (style.border.top.color.indexed !== undefined) {
          style.border.top.color.argb = indexToColor(
            style.border.top.color.indexed
          );
        }

        if (style.border.top.color.theme !== undefined) {
          if (style.border.top.color.tint !== undefined) {
            style.border.top.color.argb = tintToColor(themeToColor(
              style.border.top.color.theme
            ), style.border.top.color.tint);
          } else {
            style.border.top.color.argb = themeToColor(
              style.border.top.color.theme
            );
          }
        }
      }

      if (style.border.bottom && style.border.bottom.color) {
        if (style.border.bottom.color.indexed !== undefined) {
          style.border.bottom.color.argb = indexToColor(
            style.border.bottom.color.indexed
          );
        }

        if (style.border.bottom.color.theme !== undefined) {
          if (style.border.bottom.color.tint !== undefined) {
            style.border.bottom.color.argb = tintToColor(themeToColor(
              style.border.bottom.color.theme
            ), style.border.bottom.color.tint);
          } else {
            style.border.bottom.color.argb = themeToColor(
              style.border.bottom.color.theme
            );
          }
        }
      }
    }

    if (style.fill) {
      if (style.fill.fgColor) {
        if (style.fill.fgColor.indexed !== undefined) {
          style.fill.fgColor.argb = indexToColor(style.fill.fgColor.indexed);
        }

        // TODO: handle themed color
        if (style.fill.fgColor.theme !== undefined) {
          if (style.fill.fgColor.tint !== undefined) {
            style.fill.fgColor.argb = tintToColor(themeToColor(style.fill.fgColor.theme), style.fill.fgColor.tint);
          } else {
            style.fill.fgColor.argb = themeToColor(style.fill.fgColor.theme); 
          }
        }
      }
    }
  }

  return style;
}

export const adaptToArray = _adaptToArray;
