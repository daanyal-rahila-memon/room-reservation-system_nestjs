import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookingService } from './booking.service';
import {
  AddBookingInput,
  Booking,
  UpdateBookingInput,
} from './entity/booking.entity';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { UsePipes } from '@nestjs/common';

@Resolver(() => BookingService)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Query(() => [Booking], { name: 'bookings' })
  getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  @Query(() => Booking, { name: 'booking', nullable: true })
  getBookingById(@Args('bookingId') bookingId: string) {
    return this.bookingService.getBookingById(bookingId);
  }

  @Mutation(() => Booking)
  @UsePipes(new ValidationPipe())
  createBooking(@Args('addBookingInput') addBookingInput: AddBookingInput) {
    return this.bookingService.createBooking(addBookingInput);
  }

  @Mutation(() => Booking, { nullable: true })
  deleteBooking(@Args('bookingId') bookingId: string) {
    return this.bookingService.deleteBooking(bookingId);
  }

  @Mutation(() => Booking, { nullable: true })
  @UsePipes(new ValidationPipe())
  updateBooking(
    @Args('updateBookingInput') updateBookingInput: UpdateBookingInput,
  ) {
    return this.bookingService.updateBooking(updateBookingInput);
  }
}
