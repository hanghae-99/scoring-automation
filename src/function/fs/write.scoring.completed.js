import XLSX from "xlsx";
import makeFile from "./write.answer.files.js";
import deleteAllFiles from "./delete.answer.files.js";

function loadData(inputExcelPath, answerPath, sheetName) {
  try {
    deleteAllFiles(answerPath, true);
    const workbook = XLSX.readFile(inputExcelPath);
    const worksheet = workbook.Sheets[sheetName];
    const df = XLSX.utils.sheet_to_json(worksheet);
    for (let i of df) {
      if (i.no1) makeFile(i.name, i.speciality, 1, i.no1, answerPath);
      if (i.no2) makeFile(i.name, i.speciality, 2, i.no2, answerPath);
      if (i.no3) makeFile(i.name, i.speciality, 3, i.no3, answerPath);
    }
  } catch (err) {
    console.error(err);
  }
}

export default loadData;
