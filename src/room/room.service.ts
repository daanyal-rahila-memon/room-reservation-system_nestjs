import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoomInput, Room, UpdateRoomInput } from './entity/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}

  async findAllRooms(): Promise<Room[]> {
    return await this.roomRepository.find();
  }

  async findRoomById(id: string): Promise<Room> {
    return await this.roomRepository.findOne({ where: { id: id } });
  }

  async createRoom(createRoomInput: CreateRoomInput): Promise<Room> {
    return await this.roomRepository.save(createRoomInput);
  }

  async updateRoom(updateRoomInput: UpdateRoomInput): Promise<Room> {
    let room = await this.roomRepository.findOne({
      where: { id: updateRoomInput.id },
    });
    return await this.roomRepository.save({
      ...room,
      type: updateRoomInput.type ? updateRoomInput.type : room.type,
      roomNo: updateRoomInput.roomNo ? updateRoomInput.roomNo : room.roomNo,
    });
  }

  async deleteRoom(id: string): Promise<Room> {
    let deletedRoom = await this.roomRepository.findOne({ where: { id: id } });
    if (deletedRoom) {
      await this.roomRepository.delete(id);
      return deletedRoom;
    } else {
      throw new NotFoundException('Room not found');
    }
  }
}
