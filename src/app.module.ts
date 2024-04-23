import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RepositoriesModule } from './repositories/repositories.module';
import { CommitsModule } from './commits/commits.module';
import { CodeReviewsModule } from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from './core/config/typeorm.config';
import { awsConfig } from './core/config/aws.config';
import { authConfig } from './core/config/auth.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'local' ? '.env.local' : '.env',
      load: [awsConfig, authConfig],
    }),
    AuthModule,
    UsersModule,
    RepositoriesModule,
    CommitsModule,
    CodeReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
