import fs from "fs";

function deleteFile(speciality, fileName, answerPath) {
  try {
    if (speciality == "Spring") {
      answerPath += "/java/";
    } else {
      answerPath += "/js/";
    }

    fs.unlink(answerPath + fileName, (err) => {
      console.log(`파일 "${fileName}"이(가) 삭제되었습니다.`);
    });
  } catch (err) {
    console.error(err);
  }
}

export default deleteFile;
