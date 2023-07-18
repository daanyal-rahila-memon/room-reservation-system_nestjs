import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AddBookingInput,
  Booking,
  UpdateBookingInput,
} from './entity/booking.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { RoomService } from 'src/room/room.service';
import { Observable, forkJoin, from, map, of, switchMap } from 'rxjs';
import { Room } from 'src/room/entity/room.entity';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}

  async getAllBookings(): Promise<Booking[]> {
    return await this.bookingRepository.find({
      relations: ['user', 'room'],
    });
  }

  getBookingById(bookingId: string): Observable<Booking> {
    return from(this.bookingRepository.findOne({ where: { id: bookingId } }));
  }

  createBooking(addBookingInput: AddBookingInput) {
    return forkJoin({
      user: from(this.userService.getUserById(addBookingInput.userId)),
      room: from(this.roomService.findRoomById(addBookingInput.roomId)),
    }).pipe(
      switchMap(
        ({ user, room }: { user: User; room: Room }): Observable<Booking> => {
          return from(
            this.bookingRepository.save(
              this.bookingRepository.create({
                user,
                room,
                bookingDate: addBookingInput.bookingDate,
                endDate: addBookingInput.endDate,
              }),
            ),
          );
        },
      ),
    );
    // let user = await this.userService.getUserById(addBookingInput.userId);
    // let room = await this.roomService.findRoomById(addBookingInput.roomId);
    // if (room && user) {
    //   const bookings = await this.bookingRepository.find({
    //     // to get all the bookings of the room of provided ID & Overlapping BookingTime
    //     where: {
    //       roomId: addBookingInput.roomId,
    //       bookingDate: LessThanOrEqual(addBookingInput.endDate),
    //       endDate: MoreThanOrEqual(addBookingInput.bookingDate),
    //     },
    //   });
    //   // bookings = bookings.filter(
    //   //   (booking) =>
    //   //   addBookingInput.roomId === room.id &&
    //   //   (addBookingInput.bookingDate.getTime() >= booking.endDate.getTime() &&
    //   //   addBookingInput.endDate.getTime() <= booking.endDate.getTime()),
    //   // );

    //   if (bookings.length > 0) {
    //     throw new HttpException(
    //       'Booking already exists',
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   } else {
    //     const newBooking = new Booking();
    //     newBooking.bookingDate = addBookingInput.bookingDate;
    //     newBooking.endDate = addBookingInput.endDate;
    //     newBooking.user = user;
    //     newBooking.room = room;
    //     return await this.bookingRepository.save(newBooking);
    //   }
    // } else {
    //   throw new BadRequestException('Room or User not found');
    // }
  }

  public doesBookingExist(
    addBookingInput: AddBookingInput,
  ): Observable<boolean> {
    return from(
      this.bookingRepository.findOne({
        where: {
          roomId: addBookingInput.roomId,
          bookingDate: LessThanOrEqual(addBookingInput.endDate),
          endDate: MoreThanOrEqual(addBookingInput.bookingDate),
        },
      }),
    ).pipe(map((booking: Booking): boolean => (booking ? false : true)));
  }

  public create(addBookingInput: AddBookingInput): Observable<Booking> {
    return this.doesBookingExist(addBookingInput).pipe(
      switchMap((bookingExists: boolean) => {
        if (bookingExists === true) {
          throw new Error('Booking already exists');
        }
        return forkJoin({
          user: from(this.userService.getUserById(addBookingInput.userId)),
          room: from(this.roomService.findRoomById(addBookingInput.roomId)),
        });
      }),
      switchMap(
        ({ user, room }: { user: User; room: Room }): Observable<Booking> => {
          if (!room || !user) {
            throw new Error('Room or User not found');
          }
          return from(
            this.bookingRepository.save(
              this.bookingRepository.create({
                user,
                room,
                bookingDate: addBookingInput.bookingDate,
                endDate: addBookingInput.endDate,
              }),
            ),
          );
        },
      ),
    );
  }

  async deleteBooking(bookingId: string): Promise<void> {
    await this.bookingRepository.delete(bookingId);
  }

  async updateBooking(
    updateBookingInput: UpdateBookingInput,
  ): Promise<Booking> {
    let booking = await this.bookingRepository.findOne({
      where: { id: updateBookingInput.id },
      relations: ['user', 'room'],
    });

    if (booking) {
      // let user = await this.userService.getUserById(updateBookingInput.userId); // getting user details to check if the user exists or not
      // let room = await this.roomService.findRoomById(updateBookingInput.roomId); // getting user details to check if the room exists or not

      // if (room && user) {
      const bookings = await this.bookingRepository.find({
        // to get all the bookings of the room of provided ID & Overlapping BookingTime
        where: {
          roomId: updateBookingInput.roomId,
          bookingDate: LessThanOrEqual(updateBookingInput.endDate),
          endDate: MoreThanOrEqual(updateBookingInput.bookingDate),
        },
      });

      if (bookings.length > 0) {
        throw new HttpException(
          `Cannot update, Overlapping with existing Booking Timings of this room`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        let userToUpdate = updateBookingInput.userId
          ? await this.userService.getUserById(updateBookingInput.userId)
          : booking.user;
        let roomToUpdate = updateBookingInput.roomId
          ? await this.roomService.findRoomById(updateBookingInput.roomId)
          : booking.room;
        return await this.bookingRepository.save({
          ...booking,
          bookingDate: updateBookingInput.bookingDate
            ? updateBookingInput.bookingDate
            : booking.bookingDate,
          endDate: updateBookingInput
            ? updateBookingInput.endDate
            : booking.endDate,
          user: userToUpdate,
          room: roomToUpdate,
        });
      }
      // } else {
      //   throw new BadRequestException(
      //     'Room or User not found, Provide Valid details of Room & User',
      //   );
      // }
    } else {
      throw new HttpException(
        'Booking not found, Provide Valid details of Booking',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
