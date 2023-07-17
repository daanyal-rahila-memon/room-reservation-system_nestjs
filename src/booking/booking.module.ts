import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entity/booking.entity';
import { BookingResolver } from './booking.resolver';
import { BookingService } from './booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  providers: [BookingResolver, BookingService],
})
export class BookingModule {}
