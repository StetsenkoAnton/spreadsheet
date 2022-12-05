const VALUE_KEY = "v";

// adapt Sheetjs sheet object to 2 dimentional array
function _adaptToArray(spreadsheet) {
  let adaptedData = [];

  if (spreadsheet && spreadsheet["!data"]) {
    let maxCellIndex = 0;

    for (let ri = 0; ri < spreadsheet["!data"].length; ri++) {
      let row = spreadsheet["!data"][ri];
      let rowData = {
        lineNumber: ri,
        row: [],
      };

      if (row) {
        if (row.length > maxCellIndex) {
          maxCellIndex = row.length;
        }

        for (let ci = 0; ci < maxCellIndex; ci++) {
          if (row[ci]) {
            // push row's cell to rowData array
            rowData.row.push({
              value: row[ci][VALUE_KEY],
              column: ci,
            });
          } else {
            rowData.row.push({
              value: "",
              column: ci,
            });
          }
        }
      }

      // push each row to returned array
      adaptedData.push(rowData);
    }

    _normilizeDimentionalArray(adaptedData, maxCellIndex);
  } else {
    console.error("Unable to read spreadsheet", spreadsheet);
  }

  return adaptedData;
}
// {
//   TABLENAME: {
//     selectedList: []
//     rawTable: []
//   }
// }
// rawTable
// normalize two dimentional array to match subarray length - maxCellIndex
function _normilizeDimentionalArray(array, maxCellIndex) {
  for (let i = 0; i < array.length; i++) {
    let rowData = array[i];

    if (rowData.row.length < maxCellIndex) {
      for (let ci = rowData.row.length; ci < maxCellIndex; ci++) {
        rowData.row.push("");
      }
    }
  }
}

function _adaptFromArray(array) {
    console.log(array);
}

export const adaptToArray = _adaptToArray;
export const adaptFromArray = _adaptFromArray;
