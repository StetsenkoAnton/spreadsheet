const VALUE_KEY = 'v';

// adapt Sheetjs sheet object to 2 dimentional array
function _adaptToArray(spreadsheet) {
    let adaptedData = [];

    if (spreadsheet && spreadsheet['!data']) {
        console.log(spreadsheet);
        let maxCellIndex = 0;

        for (let ri = 0; ri < spreadsheet['!data'].length; ri++) {
            let rowData = [];
            let row = spreadsheet['!data'][ri];

            if (row) {
                if (row.length > maxCellIndex) {
                    maxCellIndex = row.length;
                }
                
                for (let ci = 0; ci < maxCellIndex; ci++) {
                    if (row[ci]) {
                        // push row's cell to rowData array
                        rowData.push(row[ci][VALUE_KEY]);
                    } else {
                        rowData.push('');
                    }
                }
            }

            // push each row to returned array
            adaptedData.push(rowData);
        }

        _normilizeDimentionalArray(adaptedData, maxCellIndex);
    } else {
        console.error('Unable to read spreadsheet', spreadsheet);
    }
    

    return adaptedData;
}

// normalize two dimentional array to match subarray length - maxCellIndex
function _normilizeDimentionalArray(array, maxCellIndex) {
    for (let i = 0; i < array.length; i++) {
        let row = array[i];

        if (row.length < maxCellIndex) {
            for (let ci = row.length; ci < maxCellIndex; ci++) {
                row.push('');
            }
        }
    }
}

function _adaptFromArray(array) {
    
}

export const adaptToArray = _adaptToArray;
export const adaptFromArray = _adaptFromArray;



