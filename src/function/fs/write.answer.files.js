import path from "path";
import fs from "fs";
const __dirname = path.resolve();

function makeFile(name, speciality, no, content) {
  try {
    console.log(__dirname);
    let filePath = `${__dirname}/../output/`;
    let fileName = "";
    fs.mkdirSync(filePath, { recursive: true }); // 경로의 디렉토리를 생성합니다.
    fs.mkdirSync(filePath + "java", { recursive: true }); // java directory
    fs.mkdirSync(filePath + "js", { recursive: true }); // js directory

    if (speciality == "Spring") {
      filePath += "java/";
      fileName += `${name}_${speciality}_${no}.java`;
    } else {
      filePath += "js/";
      fileName += `${name}_${speciality}_${no}.js`;
    }

    fs.writeFile(filePath + fileName, content, "utf8", (err) => {
      console.log(`파일 "${fileName}"이(가) 생성되었습니다.`);
    });
  } catch (err) {
    console.error(err);
  }
}

export default makeFile;
