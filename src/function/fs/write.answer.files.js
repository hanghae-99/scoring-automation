import fs from "fs";

function makeFile(name, speciality, no, content, answerPath) {
  try {
    let fileName = "";
    fs.mkdirSync(answerPath, { recursive: true }); // 경로의 디렉토리를 생성합니다.
    fs.mkdirSync(answerPath + "/java", { recursive: true }); // java directory
    fs.mkdirSync(answerPath + "/js", { recursive: true }); // js directory

    if (speciality == "Spring") {
      answerPath += "/java/";
      fileName += `${name}_${speciality}_${no}.java`;
    } else {
      answerPath += "/js/";
      fileName += `${name}_${speciality}_${no}.js`;
    }

    fs.writeFile(answerPath + fileName, content, "utf8", (err) => {
      console.log(`파일 "${fileName}"이(가) 생성되었습니다.`);
    });
  } catch (err) {
    console.error(err);
  }
}

export default makeFile;
