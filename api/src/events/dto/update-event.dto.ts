import { IsString,IsArray,ArrayMinSize, IsNotEmpty, Validate } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsUUID } from '../../lib/classValidator';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsString()
  @IsNotEmpty()
  @Validate(IsUUID)
  public id: string;
}

export class UpdateManyEventsDto {
	@IsArray()
	@ArrayMinSize(1)
	public items: UpdateEventDto[];
}
