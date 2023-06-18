import { NestFactory } from '@nestjs/core';
import { ScoreModule } from './cli.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(ScoreModule);
}
void bootstrap();
