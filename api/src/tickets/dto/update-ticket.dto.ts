import { IsString, IsArray,ArrayMinSize,IsNotEmpty, Validate } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { IsUUID } from '../../lib/classValidator';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @IsString()
  @IsNotEmpty()
  @Validate(IsUUID)
  public id: string;
}

export class UpdateManyTicketsDto  {
	@IsArray()
	@ArrayMinSize(1)
	public items: UpdateTicketDto[];
}