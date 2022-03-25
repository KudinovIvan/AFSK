/* код позаимствован отсюда https://medium.com/@danny.pule/export-json-to-csv-file-using-javascript-a0b7bc5b00d2 */
/* и чутка переписан */

let convertToCSV = (objArray) => {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in array[i]) {
            if (array[i].hasOwnProperty(index)) {
                if (line !== '') line += ','
                line += array[i][index];
            }
        }
        str += line + '\r\n';
    }
    return str;
}


let exportCSVFile = (headers, items, fileTitle) => {
    if (headers) {
        items.unshift(headers);
    }

    let jsonObject = JSON.stringify(items);

    let csv = convertToCSV(jsonObject);

    let exportedFilename = fileTitle + '.csv' || 'export.csv';

    let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { //
        navigator.msSaveBlob(blob, exportedFilename);
    } else {
        let link = document.createElement("a");
        if (link.download !== undefined) {
            let url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
