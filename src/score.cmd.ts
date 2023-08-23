import { program } from 'commander';

export const scoreCommand = program
  .option('-t, --test <test>', 'test kind')
  .option('-f, --file <file>', 'xlsx file path')
  .option('-s, --sheet <sheet>', 'sheet name')
  .parse();
