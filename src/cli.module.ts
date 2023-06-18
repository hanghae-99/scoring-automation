import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { CommandDiscoveryService } from './command/cmd.discovery.service';
import { XlsxService } from './xlsx/xlsx.service';
import { ScoreService } from './score/score.service';
import { CommandService } from './command/cmd.service';

@Module({
  imports: [DiscoveryModule],
  providers: [
    CommandDiscoveryService,
    CommandService,
    ScoreService,
    XlsxService,
  ],
})
export class ScoreModule {}
