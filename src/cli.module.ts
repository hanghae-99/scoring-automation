import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { CommandDiscoveryService } from './command/cmd.discovery.service';
import { XlsxService } from './xlsx/xlsx.service';
import { ScoreService } from './score/score.service';
import { CommandService } from './command/cmd.service';
import { JavaService } from './score/language/java.service';
import { JavascriptService } from './score/language/js.service';

@Module({
  imports: [DiscoveryModule],
  providers: [
    CommandDiscoveryService,
    CommandService,
    ScoreService,
    XlsxService,
    JavaService,
    JavascriptService,
  ],
})
export class ScoreModule {}
