import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoomService } from './room.service';
import { CreateRoomInput, Room, UpdateRoomInput } from './entity/room.entity';

@Resolver(() => RoomService)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}

  @Query(() => [Room], { name: 'rooms' })
  getAllRooms() {
    return this.roomService.findAllRooms();
  }

  @Query(() => Room, { name: 'room', nullable: true })
  getRoomById(@Args('roomId') roomId: string) {
    return this.roomService.findRoomById(roomId);
  }

  @Mutation(() => Room)
  createRoom(
    @Args({ name: 'createRoomInput', type: () => CreateRoomInput })
    createRoomInput: CreateRoomInput,
  ) {
    return this.roomService.createRoom(createRoomInput);
  }

  @Mutation(() => Room, { nullable: true })
  updateRoom(
    @Args({ name: 'updateRoomInput', type: () => UpdateRoomInput })
    updateRoomInput: UpdateRoomInput,
  ) {
    return this.roomService.updateRoom(updateRoomInput);
  }

  @Mutation(() => Boolean, { nullable: true })
  deleteRoom(@Args('roomId') roomId: string) {
    return this.roomService.deleteRoom(roomId);
  }
}
