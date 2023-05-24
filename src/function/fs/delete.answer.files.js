import path from "path";
import fs from "fs";
const __dirname = path.resolve();
function deleteFilesInDirectory(folderPath) {
  if (!fs.existsSync(folderPath)) {
    console.log("폴더가 존재하지 않습니다.");
    return;
  }

  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    console.log(stats.isDirectory());
    fs.unlinkSync(filePath); // 파일 삭제
    console.log(`파일 "${filePath}"이(가) 삭제되었습니다.`);
  });
}
function deleteAllFiles() {
  let folderPath = __dirname + "/../output/js";
  deleteFilesInDirectory(folderPath);
  folderPath = __dirname + "/../output/java";
  deleteFilesInDirectory(folderPath);
}
export default deleteAllFiles;
