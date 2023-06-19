import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.';
// ts-node src/main.ts -f 답안_예시.xlsx -s 시트1 -t alg
async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule);
}
void bootstrap();
