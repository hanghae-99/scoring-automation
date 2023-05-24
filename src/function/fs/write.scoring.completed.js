import XLSX from "xlsx";
import path from "path";
import makeFile from "./write.answer.files.js";
import deleteAllFiles from "./delete.answer.files.js";
const __dirname = path.resolve();
function loadData() {
  try {
    deleteAllFiles();
    let workbook = XLSX.readFile(__dirname + `/../src/test2.xlsx`);
    let worksheet = workbook.Sheets[`설문지 응답 시트1`];
    var df = XLSX.utils.sheet_to_json(worksheet);
    for (let i of df) {
      if (i.no1) makeFile(i.name, i.speciality, 1, i.no1);
      if (i.no2) makeFile(i.name, i.speciality, 2, i.no2);
      if (i.no3) makeFile(i.name, i.speciality, 3, i.no3);
    }
  } catch (err) {
    console.error(err);
  }
}

export default loadData;
