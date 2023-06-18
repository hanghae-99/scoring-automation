import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ScoreService } from './score.service';
import { CommandService } from './command.service';

@Module({
  imports: [DiscoveryModule],
  providers: [CommandService, ScoreService],
})
export class ScoreModule {}
