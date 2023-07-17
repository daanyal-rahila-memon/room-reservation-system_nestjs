
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface AddUserInput {
    name: string;
    email: string;
}

export interface UpdateUserInput {
    id: string;
    name?: Nullable<string>;
    email?: Nullable<string>;
}

export interface CreateRoomInput {
    roomNo?: Nullable<number>;
    type?: Nullable<string>;
}

export interface UpdateRoomInput {
    id: string;
    roomNo?: Nullable<number>;
    type?: Nullable<string>;
}

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface Room {
    id: string;
    roomNo: number;
    type?: Nullable<string>;
    occupied: boolean;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface IQuery {
    users(): User[] | Promise<User[]>;
    user(userId: string): Nullable<User> | Promise<Nullable<User>>;
    rooms(): Room[] | Promise<Room[]>;
    room(id: string): Room | Promise<Room>;
}

export interface IMutation {
    createUser(addUserInput: AddUserInput): User | Promise<User>;
    updateUser(updateUserInput: UpdateUserInput): Nullable<User> | Promise<Nullable<User>>;
    deleteUser(userId: string): Nullable<User> | Promise<Nullable<User>>;
    createRoom(createRoomInput: CreateRoomInput): Room | Promise<Room>;
    updateRoom(updateRoomInput: UpdateRoomInput): Room | Promise<Room>;
    deleteRoom(id: string): Room | Promise<Room>;
}

export type DateTime = any;
type Nullable<T> = T | null;
