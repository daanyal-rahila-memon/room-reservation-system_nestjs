import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AddBookingInput,
  Booking,
  UpdateBookingInput,
} from './entity/booking.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async getAllBookings(): Promise<Booking[]> {
    return await this.bookingRepository.find();
  }

  async getBookingById(bookingId: string): Promise<Booking> {
    return await this.bookingRepository.findOne({ where: { id: bookingId } });
  }

  async createBooking(addBookingInput: AddBookingInput): Promise<Booking> {
    let bookings = await this.bookingRepository.find();
    bookings = bookings.filter(
      (booking) =>
        booking.bookingDate.getTime() ===
          addBookingInput.bookingDate.getTime() &&
        booking.endDate.getTime() === addBookingInput.endDate.getTime(),
    );

    if (bookings.length > 0) {
      throw new HttpException('Booking alreadu exists', HttpStatus.BAD_REQUEST);
    } else {
      const newBooking = new Booking();
      newBooking.bookingDate = addBookingInput.bookingDate;
      newBooking.endDate = addBookingInput.endDate;
      newBooking.user = addBookingInput.user;
      newBooking.room = addBookingInput.room;
      return await this.bookingRepository.save(newBooking);
    }
  }

  async deleteBooking(bookingId: string): Promise<void> {
    await this.bookingRepository.delete(bookingId);
  }

  async updateBooking(
    updateBookingInput: UpdateBookingInput,
  ): Promise<Booking> {
    let booking = await this.bookingRepository.findOne({
      where: { id: updateBookingInput.id },
    });

    if (booking) {
      return await this.bookingRepository.save({
        ...booking,
        bookingDate: updateBookingInput
          ? updateBookingInput.bookingDate
          : booking.bookingDate,
        endDate: updateBookingInput
          ? updateBookingInput.endDate
          : booking.endDate,
        user: updateBookingInput ? updateBookingInput.user : booking.user,
        room: updateBookingInput ? updateBookingInput.room : booking.room,
      });
    } else {
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }
  }
}
