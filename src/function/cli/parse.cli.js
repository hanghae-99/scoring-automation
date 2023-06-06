import { program } from "commander";

program
  .option("-f, --file <filePath>", "target excel file path")
  .option("-s, --sheet <sheetName>", "sheet name of the excel file")
  .option("-a, --answer <answerPath>", "answer code directory path")
  .option("-o, --output <outputPath>", "output directory path")
  .option("-d, --delete", "delete all user input code files directory");

program.parse();

export const options = program.opts();
