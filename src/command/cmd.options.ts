import { program } from 'commander';

export const CLI_OPTIONS = program
  .option('-t, --test <test>', 'test kind')
  .option('-f, --file <file>', 'xlsx file to parse')
  .option('-s, --sheet <sheet>', 'sheet name to parse')
  .parse()
  .opts();
