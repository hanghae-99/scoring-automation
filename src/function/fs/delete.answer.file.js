import path from "path";
import fs from "fs";
const __dirname = path.resolve();

function deleteFile(speciality, name) {
  try {
    let filePath = `${__dirname}/../output/`;
    let fileName = name;
    console.log(fileName);
    if (speciality == "Spring") {
      filePath += "java/";
    } else {
      filePath += "js/";
    }

    fs.unlink(filePath + fileName, (err) => {
      console.log(`파일 "${fileName}"이(가) 삭제되었습니다.`);
    });
  } catch (err) {
    console.error(err);
  }
}

export default deleteFile;
