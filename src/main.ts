import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ServiceExceptionToHttpExceptionFilter } from './core/filters/http-exception.filter';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // 전역 범위 필터 설정
  app.useGlobalFilters(new ServiceExceptionToHttpExceptionFilter());

  // 전역 범위 인터셉터 설정
  app.useGlobalInterceptors(new LoggingInterceptor());

  // 전역 범위 파이프 설정 (유효성 검사 파이프)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에서 정의되지 않은 속성을 제거
      forbidNonWhitelisted: true, // 정의되지 않은 속성이 포함된 경우 요청을 거부
      transform: true, // 요청에서 받은 데이터를 DTO 인스턴스로 변환
      disableErrorMessages: false, // 프로덕션 환경에서는 true로 설정하여 에러 메시지 노출 방지
    }),
  );

  app.enableCors({
    origin: ['https://prlc.kr', 'http://localhost:3001'],
    credentials: true,
    exposedHeaders: ['Authorization'], // * 사용할 헤더 추가.
  });

  // 애플리케이션 포트 설정 및 서버 실행
  await app.listen(3000);
}

bootstrap();
