import { Module } from '@nestjs/common';
import { CodeReviewService } from './reviews.service';
import { CodeReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeReview } from './entities/review.entity';
import { Commit } from 'src/commits/entities/commit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CodeReview, Commit])],
  controllers: [CodeReviewsController],
  providers: [CodeReviewService],
})
export class CodeReviewsModule {}
