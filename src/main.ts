import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.';
// npm i -g ts-node
// npm i
// ts-node src/main.ts -f 답안_예시.xlsx -s 자동채점테스트 -t alg
// ts-node src/main.ts -f API_답안_예시.xlsx -s 자동채점테스트 -t api
async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule);
}
void bootstrap();
