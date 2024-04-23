// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto) {
    const response = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        ...user,
        roleId: 1,
        username: user.name,
      })
      .orUpdate(['accessToken'], ['githubId'])
      .execute();

    return response;
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUser(githubId: string) {
    const user = await this.userRepository.findOne({ where: { githubId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${githubId} not found.`);
    }

    const repositories = await user.repositories;
    const commits = await user.commits;

    return {
      avatar: user.avatar,
      location: user.location,
      description: user.description,
      username: user.username,
      repositories,
      commits,
    };
  }

  async findOneUser(githubId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { githubId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${githubId} not found.`);
    }
    return user;
  }

  async updateUser(githubId: string, updateUser: Partial<User>): Promise<User> {
    const user = await this.findOneUser(githubId); // Reuse the findOneUser method to include error handling
    const updatedUser = Object.assign(user, updateUser);
    return this.userRepository.save(updatedUser);
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
  }
}
