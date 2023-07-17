import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Room } from 'src/room/entity/room.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  bookingDate: Date;

  @Column()
  @Field()
  endDate: Date;

  @OneToOne(() => User)
  @JoinColumn()
  @Field()
  user: User;

  @OneToOne(() => Room)
  @JoinColumn()
  @Field()
  room: Room;
}

@InputType()
export class AddBookingInput {
  @Field()
  bookingDate: Date;

  @Field()
  endDate: Date;

  @Field()
  user: User;

  @Field()
  room: Room;
}

@InputType()
export class UpdateBookingInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  bookingDate: Date;

  @Field({ nullable: true })
  endDate: Date;

  @Field({ nullable: true })
  user: User;

  @Field({ nullable: true })
  room: Room;
}
