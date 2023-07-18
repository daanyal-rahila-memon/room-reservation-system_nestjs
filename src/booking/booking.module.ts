import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entity/booking.entity';
import { BookingResolver } from './booking.resolver';
import { BookingService } from './booking.service';
import { RoomModule } from 'src/room/room.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), RoomModule, UserModule],
  providers: [BookingResolver, BookingService],
})
export class BookingModule {}
