import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoomInput, Room, UpdateRoomInput } from './entity/room.entity';
import { Repository } from 'typeorm';
import { Observable, catchError, from, map, of, switchMap } from 'rxjs';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}

  findAllRooms(): Observable<Room[]> {
    return from(this.roomRepository.find());
  }

  findRoomById(id: string): Observable<Room> {
    return from(this.roomRepository.findOne({ where: { id: id } }));
  }

  createRoom(createRoomInput: CreateRoomInput): Observable<Room> {
    return from(this.roomRepository.save(createRoomInput));
  }

  doesRooomExist(updateRoomInput: UpdateRoomInput): Observable<Room> {
    return from(
      this.roomRepository.findOne({
        where: { id: updateRoomInput.id },
      }),
    );
  }

  updateRoom(updateRoomInput: UpdateRoomInput): Observable<Room> {
    return this.doesRooomExist(updateRoomInput).pipe(
      switchMap((room: Room) => {
        if (room) {
          return from(
            this.roomRepository.save({
              ...room,
              type: updateRoomInput.type ? updateRoomInput.type : room.type,
              roomNo: updateRoomInput.roomNo
                ? updateRoomInput.roomNo
                : room.roomNo,
            }),
          );
        } else {
          throw new NotFoundException('Room not found');
        }
      }),
    );
    // let room = await this.roomRepository.findOne({
    //   where: { id: updateRoomInput.id },
    // });
    // return await this.roomRepository.save({
    //   ...room,
    //   type: updateRoomInput.type ? updateRoomInput.type : room.type,
    //   roomNo: updateRoomInput.roomNo ? updateRoomInput.roomNo : room.roomNo,
    // });
  }

  deleteRoom(id: string): Observable<boolean> {
    return from(this.roomRepository.findOne({ where: { id: id } })).pipe(
      switchMap((room: Room) => {
        if (room) {
          return from(this.roomRepository.delete(room.id));
        } else {
          throw new NotFoundException('Room not found');
        }
      }),
      map(() => true),
      catchError(() => of(false)),
    );
    // let deletedRoom = await this.roomRepository.findOne({ where: { id: id } });
    // if (deletedRoom) {
    //   await this.roomRepository.delete(id);
    //   return deletedRoom;
    // } else {
    //   throw new NotFoundException('Room not found');
    // }
  }
}
