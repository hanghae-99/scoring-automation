import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { CommandDiscoveryService } from './command/cmd.discovery.service';
import { XlsxService } from './xlsx/xlsx.service';
import { ScoreService } from './score/score.service';
import { CommandService } from './app.service';
import { JavaService } from './score/language/java.service';
import { JavascriptService } from './score/language/js.service';
import { CommandModule } from './command/cmd.decorator';
import { program } from 'commander';

@CommandModule({
  imports: [DiscoveryModule],
  providers: [
    CommandDiscoveryService,
    CommandService,
    ScoreService,
    XlsxService,
    JavaService,
    JavascriptService,
  ],
  command: program
    .option('-t, --test <test>', 'test kind')
    .option('-f, --file <file>', 'xlsx file name')
    .option('-s, --sheet <sheet>', 'sheet name')
    .parse(),
})
export class AppModule {}
