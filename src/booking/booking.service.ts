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
import {
  DeleteResult,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { UserService } from 'src/user/user.service';
import { RoomService } from 'src/room/room.service';
import {
  Observable,
  catchError,
  forkJoin,
  from,
  map,
  of,
  switchMap,
} from 'rxjs';
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

  getAllBookings(): Observable<Booking[]> {
    return from(
      this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoinAndSelect('booking.user', 'user')
        .leftJoinAndSelect('booking.room', 'room')
        .getMany(),
    );
  }

  getBookingById(bookingId: string): Observable<Booking> {
    return from(
      this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoinAndSelect('booking.user', 'user')
        .leftJoinAndSelect('booking.room', 'room')
        .where('booking.id = :bId  AND room.name = :roomName', {
          bId: bookingId,
          roomName: 'someRoomName',
        })
        .getOne(),
    );
  }

  createBooking(addBookingInput: AddBookingInput) {
    return forkJoin({
      user: from(this.userService.getUserById(addBookingInput.userId)),
      room: from(this.roomService.findRoomById(addBookingInput.roomId)),
    }).pipe(
      switchMap(
        ({ user, room }: { user: User; room: Room }): Observable<Booking> => {
          return this.create(addBookingInput);
          // return from(
          //   this.bookingRepository.save(
          //     this.bookingRepository.create({
          //       user,
          //       room,
          //       bookingDate: addBookingInput.bookingDate,
          //       endDate: addBookingInput.endDate,
          //     }),
          //   ),
          // );
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

  public doesBookingExistWithGivenTime(
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
    return this.doesBookingExistWithGivenTime(addBookingInput).pipe(
      switchMap((bookingExists: boolean) => {
        if (bookingExists === false) {
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

  doesBookingExist(
    updateBookingInput: UpdateBookingInput,
  ): Observable<Booking> {
    return from(
      this.bookingRepository.findOne({
        where: { id: updateBookingInput.id },
        relations: ['user', 'room'],
      }),
    );
  }

  updateBooking(updateBookingInput: UpdateBookingInput): Observable<Booking> {
    // let booking = await this.bookingRepository.findOne({
    //   where: { id: updateBookingInput.id },
    //   relations: ['user', 'room'],
    // });
    return this.doesBookingExist(updateBookingInput).pipe(
      switchMap((bookingExists: Booking) => {
        if (bookingExists) {
          return forkJoin({
            user: updateBookingInput.userId
              ? from(this.userService.getUserById(updateBookingInput.userId))
              : of(bookingExists.user),
            room: updateBookingInput.roomId
              ? from(this.roomService.findRoomById(updateBookingInput.roomId))
              : of(bookingExists.room),
            booking: of(bookingExists),
          });
        } else {
          throw new Error(`Booking with '${updateBookingInput.id}' not found`);
        }
      }),
      switchMap(
        ({
          user,
          room,
          booking,
        }: {
          user: User;
          room: Room;
          booking: Booking;
        }) => {
          if (!room || !user) {
            throw new Error('Room or User not found');
          } else {
            return from(
              this.bookingRepository.save({
                ...booking,
                bookingDate: updateBookingInput.bookingDate
                  ? updateBookingInput.bookingDate
                  : booking.bookingDate,
                endDate: updateBookingInput.endDate
                  ? updateBookingInput.endDate
                  : booking.endDate,
                user: user,
                room: room,
              }),
            );
          }
        },
      ),
    );
    // if (booking) {
    //   // let user = await this.userService.getUserById(updateBookingInput.userId); // getting user details to check if the user exists or not
    //   // let room = await this.roomService.findRoomById(updateBookingInput.roomId); // getting user details to check if the room exists or not

    //   // if (room && user) {
    //   const bookings = await this.bookingRepository.find({
    //     // to get all the bookings of the room of provided ID & Overlapping BookingTime
    //     where: {
    //       roomId: updateBookingInput.roomId,
    //       bookingDate: LessThanOrEqual(updateBookingInput.endDate),
    //       endDate: MoreThanOrEqual(updateBookingInput.bookingDate),
    //     },
    //   });

    //   if (bookings.length > 0) {
    //     throw new HttpException(
    //       `Cannot update, Overlapping with existing Booking Timings of this room`,
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   } else {
    //     let userToUpdate = updateBookingInput.userId
    //       ? await this.userService.getUserById(updateBookingInput.userId)
    //       : booking.user;
    //     let roomToUpdate = updateBookingInput.roomId
    //       ? await this.roomService.findRoomById(updateBookingInput.roomId)
    //       : booking.room;
    //     return await this.bookingRepository.save({
    //       ...booking,
    //       bookingDate: updateBookingInput.bookingDate
    //         ? updateBookingInput.bookingDate
    //         : booking.bookingDate,
    //       endDate: updateBookingInput
    //         ? updateBookingInput.endDate
    //         : booking.endDate,
    //       user: userToUpdate,
    //       room: roomToUpdate,
    //     });
    //   }
    //   // } else {
    //   //   throw new BadRequestException(
    //   //     'Room or User not found, Provide Valid details of Room & User',
    //   //   );
    //   // }
    // } else {
    //   throw new HttpException(
    //     'Booking not found, Provide Valid details of Booking',
    //     HttpStatus.NOT_FOUND,
    //   );
    // }
  }

  deleteBooking(bookingId: string): Observable<boolean> {
    return from(
      this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.id = :bookingId', { bookingId })
        .getOne(),
    ).pipe(
      switchMap((booking: Booking) => {
        if (booking) {
          return from(this.bookingRepository.delete(booking.id));
        } else {
          throw new Error('Booking not found');
        }
      }),
      map(() => true),
      catchError(() => of(false)),
    );
  }

  getAllBooking(page: number, limit: number) {
    let roomIds = ['123', '456'];

    return from(
      this.bookingRepository.find({
        where: {
          roomId: In(roomIds),
        },
        take: limit,
        skip: limit * (page - 1),
      }),
    );
    // return from(this.bookingRepository.createQueryBuilder('booking')
    // .take(limit)
    // .skip(limit * (page - 1))
    // .where("booking.roomId IN(:...roomIds)", { roomIds})
    // .getMany())
  }
}
