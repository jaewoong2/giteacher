import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Res,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { Response } from 'express';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser({ ...createUserDto });
  }

  @Get('/:githubId')
  async find(@Param('githubId') githubId: string) {
    const user = await this.usersService.findUser(githubId);

    return user;
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  findMe(@Res() res: Response) {
    console.log(res);

    return;
  }
}
