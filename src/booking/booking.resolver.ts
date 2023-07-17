import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookingService } from './booking.service';
import {
  AddBookingInput,
  Booking,
  UpdateBookingInput,
} from './entity/booking.entity';

@Resolver(() => BookingService)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Query(() => [Booking])
  getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  @Query(() => Booking)
  getBookingById(@Args('bookingId') bookingId: string) {
    return this.bookingService.getBookingById(bookingId);
  }

  @Mutation(() => Booking)
  createBooking(@Args('addBookingInput') addBookingInput: AddBookingInput) {
    return this.bookingService.createBooking(addBookingInput);
  }

  @Mutation(() => Booking)
  deleteBooking(@Args('bookingId') bookingId: string) {
    return this.bookingService.deleteBooking(bookingId);
  }

  @Mutation(() => Booking)
  updateBooking(
    @Args('updateBookingInput') updateBookingInput: UpdateBookingInput,
  ) {
    return this.bookingService.updateBooking(updateBookingInput);
  }
}
