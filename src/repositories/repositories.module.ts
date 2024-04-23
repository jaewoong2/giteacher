import { Module } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import { RepositoriesController } from './repositories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from './entities/repository.entity';
import { User } from 'src/users/entities/user.entity';
import { EventBridgeService } from 'src/core/eventbridge.service';

@Module({
  imports: [TypeOrmModule.forFeature([Repository, User])],
  controllers: [RepositoriesController],
  providers: [RepositoriesService, EventBridgeService],
})
export class RepositoriesModule {}
