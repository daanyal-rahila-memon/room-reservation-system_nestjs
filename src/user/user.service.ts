import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddUserInput, UpdateUserInput, User } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    // return await this.userRepository.find();  // without join
    return await this.userRepository.find();
  }

  async getUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: id },
    });
  }

  async createUser(addUserInput: AddUserInput): Promise<User> {
    return await this.userRepository.save(addUserInput);
  }

  async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: updateUserInput.id },
    });

    return await this.userRepository.save({
      ...user,
      name: updateUserInput.name ? updateUserInput.name : user.name,
      email: updateUserInput.email ? updateUserInput.email : user.email,
    });
  }

  async deleteUser(id: string): Promise<User> {
    let deletedUser = await this.userRepository.findOne({ where: { id: id } });
    await this.userRepository.delete(id);
    return deletedUser;
  }
}
