import { NestFactory } from '@nestjs/core';
import { ScoreModule } from './score.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(ScoreModule);
}
void bootstrap();
