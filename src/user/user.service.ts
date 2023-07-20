import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddUserInput, UpdateUserInput, User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { Observable, catchError, from, map, of, switchMap } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  getAllUsers(): Observable<User[]> {
    // return await this.userRepository.find();
    return from(this.userRepository.find());
  }

  getUserById(id: string): Observable<User> {
    // return await this.userRepository.findOne({
    //   where: { id: id },
    // });
    return from(
      this.userRepository.findOne({
        where: { id: id },
      }),
    );
  }

  createUser(addUserInput: AddUserInput): Observable<User> {
    // return await this.userRepository.save(addUserInput);
    return from(this.userRepository.save(addUserInput));
  }

  updateUser(updateUserInput: UpdateUserInput): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: { id: updateUserInput.id },
      }),
    ).pipe(
      switchMap((user: User) => {
        if (user) {
          return from(
            this.userRepository.save({
              ...user,
              name: updateUserInput.name ? updateUserInput.name : user.name,
              email: updateUserInput.email ? updateUserInput.email : user.email,
            }),
          );
        } else {
          throw new NotFoundException('User not found');
        }
      }),
    );
    // const user = await this.userRepository.findOne({
    //   where: { id: updateUserInput.id },
    // });

    // return await this.userRepository.save({
    //   ...user,
    //   name: updateUserInput.name ? updateUserInput.name : user.name,
    //   email: updateUserInput.email ? updateUserInput.email : user.email,
    // });
  }

  deleteUser(id: string): Observable<boolean> {
    return from(this.userRepository.findOne({ where: { id: id } })).pipe(
      switchMap((user: User) => {
        if (user) {
          return from(this.userRepository.delete(user.id));
        } else {
          throw new Error(`User with '${user.id}' does not exist`);
        }
      }),
      map(() => true),
      catchError(() => of(false)),
    );
    // let deletedUser = await this.userRepository.findOne({ where: { id: id } });
    // await this.userRepository.delete(id);
    // return deletedUser;
  }
}
