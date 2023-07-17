import { Module } from '@nestjs/common';
import { RoomResolver } from './room.resolver';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entity/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  providers: [RoomResolver, RoomService],
})
export class RoomModule {}
