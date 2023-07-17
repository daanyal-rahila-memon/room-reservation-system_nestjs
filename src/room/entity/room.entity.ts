import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @PrimaryGeneratedColumn()
  @Field()
  roomNo: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  type?: string;

  @Column({ default: false })
  @Field({ defaultValue: false })
  occupied: boolean;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @BeforeInsert()
  public addTime(): void {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  public updateTime(): void {
    this.updatedAt = new Date();
  }
}

@InputType()
export class CreateRoomInput {
  @Field({ nullable: true })
  roomNo: number;

  @Field({ nullable: true })
  type: string;
}

@InputType()
export class UpdateRoomInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  roomNo: number;

  @Field({ nullable: true })
  type: string;
}
