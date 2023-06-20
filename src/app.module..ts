import { DiscoveryModule } from '@nestjs/core';
import { CommandService } from './command/cmd.service';
import { XlsxService } from './xlsx/xlsx.service';
import { ScoreService } from './score/score.service';
import { AppService } from './app.service';
import { JavaService } from './score/language/java.service';
import { JavascriptService } from './score/language/js.service';
import { CommandModule } from './command/cmd.decorator';
import { scoreCommand } from './score.cmd';

@CommandModule({
  imports: [DiscoveryModule],
  providers: [
    CommandService,
    AppService,
    ScoreService,
    XlsxService,
    JavaService,
    JavascriptService,
  ],
  command: scoreCommand,
})
export class AppModule {}
