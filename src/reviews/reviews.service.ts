import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commit } from 'src/commits/entities/commit.entity';
import { CodeReview } from './entities/review.entity';
import { CreateCodeReviewDto } from './dto/create-review.dto';
import { UpdateCodeReviewDto } from './dto/update-review.dto';

@Injectable()
export class CodeReviewService {
  constructor(
    @InjectRepository(CodeReview)
    private readonly codeReviewRepository: Repository<CodeReview>,
    @InjectRepository(Commit)
    private readonly commitRepository: Repository<Commit>,
  ) {}

  async create(createCodeReviewDto: CreateCodeReviewDto): Promise<CodeReview> {
    const commit = await this.commitRepository.findOne({
      where: { commitID: createCodeReviewDto.commitId },
    });

    if (!commit) {
      throw new NotFoundException(
        `Commit with ID ${createCodeReviewDto.commitId} not found`,
      );
    }

    const codeReview = this.codeReviewRepository.create({
      commit: commit,
      content: createCodeReviewDto.content,
      fileName: createCodeReviewDto.fileName,
      startIndex: createCodeReviewDto.startIndex,
      endIndex: createCodeReviewDto.endIndex,
    });

    return this.codeReviewRepository.save(codeReview);
  }

  async findAll(): Promise<CodeReview[]> {
    return this.codeReviewRepository.find({ relations: ['commit'] });
  }

  async findOne(id: number): Promise<CodeReview> {
    const codeReview = await this.codeReviewRepository.findOne({
      where: { codeReviewID: id },
      relations: ['commit'],
    });

    if (!codeReview) {
      throw new NotFoundException(`CodeReview with ID ${id} not found`);
    }

    return codeReview;
  }

  async update(
    id: number,
    updateCodeReviewDto: UpdateCodeReviewDto,
  ): Promise<CodeReview> {
    const codeReview = await this.findOne(id);
    if (updateCodeReviewDto.content) {
      codeReview.content = updateCodeReviewDto.content;
    }
    return this.codeReviewRepository.save(codeReview);
  }

  async remove(id: number): Promise<void> {
    const result = await this.codeReviewRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`CodeReview with ID ${id} not found`);
    }
  }
}
