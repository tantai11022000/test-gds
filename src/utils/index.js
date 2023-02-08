import qs from 'query-string';
import * as XLSX from 'xlsx/xlsx.mjs'
export function cleanObject(obj) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined || obj[key] === '' || obj[key] === null) {
        delete obj[key];
      }
    });
    return obj;
  }
  

export function objectToQueryString(obj) {
    const queryString = new URLSearchParams(cleanObject(obj)).toString();
    return queryString;
  }
  

export const changeNextPageUrl = (history, current) => {
    var query = qs.parse(window.location.search);
    history.push(
      '?' +
        objectToQueryString({
          ...query,
          page: current
        })
    );
    return history;
};

export const exportExcel = (data,nameSheet,nameFile) => {
  return new Promise((resolve, reject) => {
      let wb = XLSX.utils.book_new()
      let ws = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(wb,ws,nameSheet)
      XLSX.writeFile(wb,`${nameFile}.xlsx`)
      resolve('oke')
  })
}
  