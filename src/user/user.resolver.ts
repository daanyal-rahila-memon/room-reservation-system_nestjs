import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { AddUserInput, UpdateUserInput, User } from './entity/user.entity';

@Resolver(() => UserService)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Query(() => User, { name: 'user', nullable: true })
  getUserById(@Args({ name: 'userId', type: () => String }) userId: string) {
    return this.userService.getUserById(userId);
  }

  @Mutation(() => User)
  createUser(
    @Args({ name: 'addUserInput', type: () => AddUserInput })
    addUserInput: AddUserInput,
  ) {
    return this.userService.createUser(addUserInput);
  }

  @Mutation(() => User, { nullable: true })
  updateUser(
    @Args({ name: 'updateUserInput', type: () => UpdateUserInput })
    updateUserInput: UpdateUserInput,
  ) {
    return this.userService.updateUser(updateUserInput);
  }

  @Mutation(() => User, { nullable: true })
  deleteUser(@Args({ name: 'userId', type: () => String }) userId: string) {
    return this.userService.deleteUser(userId);
  }
}
