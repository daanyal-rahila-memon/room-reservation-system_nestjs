
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
    type?: Nullable<string>;
}

export interface UpdateRoomInput {
    id: string;
    roomNo?: Nullable<number>;
    type?: Nullable<string>;
}

export interface AddBookingInput {
    bookingDate: DateTime;
    endDate: DateTime;
    userId: string;
    roomId: string;
}

export interface UpdateBookingInput {
    id: string;
    bookingDate?: Nullable<DateTime>;
    endDate?: Nullable<DateTime>;
    userId?: Nullable<string>;
    roomId?: Nullable<string>;
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
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface Booking {
    id: string;
    bookingDate: DateTime;
    endDate: DateTime;
    user: User;
    room: Room;
}

export interface IQuery {
    users(): User[] | Promise<User[]>;
    user(userId: string): Nullable<User> | Promise<Nullable<User>>;
    rooms(): Room[] | Promise<Room[]>;
    room(roomId: string): Nullable<Room> | Promise<Nullable<Room>>;
    bookings(): Booking[] | Promise<Booking[]>;
    booking(bookingId: string): Nullable<Booking> | Promise<Nullable<Booking>>;
}

export interface IMutation {
    createUser(addUserInput: AddUserInput): User | Promise<User>;
    updateUser(updateUserInput: UpdateUserInput): Nullable<User> | Promise<Nullable<User>>;
    deleteUser(userId: string): Nullable<User> | Promise<Nullable<User>>;
    createRoom(createRoomInput: CreateRoomInput): Room | Promise<Room>;
    updateRoom(updateRoomInput: UpdateRoomInput): Nullable<Room> | Promise<Nullable<Room>>;
    deleteRoom(roomId: string): Nullable<Room> | Promise<Nullable<Room>>;
    createBooking(addBookingInput: AddBookingInput): Booking | Promise<Booking>;
    deleteBooking(bookingId: string): Nullable<Booking> | Promise<Nullable<Booking>>;
    updateBooking(updateBookingInput: UpdateBookingInput): Nullable<Booking> | Promise<Nullable<Booking>>;
}

export type DateTime = any;
type Nullable<T> = T | null;
