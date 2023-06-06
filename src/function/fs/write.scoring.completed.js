import XLSX from "xlsx";
import path from "path";
import makeFile from "./write.answer.files.js";
import deleteAllFiles from "./delete.answer.files.js";
import wrieXlsxFile from "write-excel-file/node";
import fs from "fs";
const __dirname = path.resolve();
export function loadData() {
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

// {”name”:”변정섭”, ”question”:1, “output”:”pass”, “time”:0.3}
export function chaejeom() {

  try { 
    const HEADER_ROW = [
      {value: "name"},
      {value: "question"},
      {value: "output"},
      {value: "time"}
    ];

  let DATA_ROW_1 = [
    // "name"
    {
      type: String,
      value: "변정섭"
    },
  
    // "question"
    {
      type: String,
      value: "1"
    },
  
    // "output"
    {
      type: String,
      value: "pass"
    },
  
    // "time"
    {
      type: Number,
      value: 0.3
    }
  ];

  const data = [HEADER_ROW, DATA_ROW_1];

  const makeExcel = async () => {
    if (!fs.existsSync("./result")) {
      // excel 폴더가 존재하지 않는 경우 excel 폴더를 생성한다.
      fs.mkdirSync("./result");
      console.log(`파일 "sfsdf"이(가) 생성되었습니다.`);

    }
    await wrieXlsxFile(data, {
      filePath: "./result/result.xlsx",
    });
  };

  makeExcel();  

  } catch (err) {
    console.error(err);
  }
}

// export default loadData;
// export default {loadData, chaejeom};

