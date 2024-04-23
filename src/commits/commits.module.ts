import { Module } from '@nestjs/common';
import { CommitsService } from './commits.service';
import { CommitsController } from './commits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commit } from './entities/commit.entity';
import { RepositoriesService } from 'src/repositories/repositories.service';
import { Repository } from 'src/repositories/entities/repository.entity';
import { User } from 'src/users/entities/user.entity';
import { EventBridgeService } from 'src/core/eventbridge.service';
import { CommitDetail } from './entities/commit-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Commit, Repository, User, CommitDetail])],
  controllers: [CommitsController],
  providers: [CommitsService, RepositoriesService, EventBridgeService],
})
export class CommitsModule {}
