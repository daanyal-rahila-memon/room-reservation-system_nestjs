import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (value.bookingDate && value.endDate) {
      if (
        value.endDate.getTime() > value.bookingDate.getTime() &&
        value.endDate.getHours() > value.bookingDate.getHours() &&
        value.endDate.getDay() >= value.bookingDate.getDay()
      ) {
        return value;
      } else {
        throw new BadRequestException(
          'Invalid Reservation Timings, Error Found throug Validation Pipe',
        );
      }
    } else {
      return value;
    }
  }
}
