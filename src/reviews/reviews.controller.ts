import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateCodeReviewDto } from './dto/create-review.dto';
import { UpdateCodeReviewDto } from './dto/update-review.dto';
import { CodeReviewService } from './reviews.service';

@Controller('api/reviews')
export class CodeReviewsController {
  constructor(private readonly reviewsService: CodeReviewService) {}

  @Post()
  create(@Body() createReviewDto: CreateCodeReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateCodeReviewDto,
  ) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
