import {
	IsOptional,
	IsString,
	IsNotEmpty,
	Length,
	IsArray,
	ArrayMinSize,
	ArrayMaxSize,
	Validate,
  } from 'class-validator';
  import { IsUUID, IsDateString } from '../../lib/classValidator';
  
  export class CreateTicketDto {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	@Validate(IsUUID)
	public id: string;
  
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	public city: string;
  
	@IsString()
	@IsNotEmpty()
	@Length(1, 128)
	@IsOptional()
	public title: string;
  
	// Validates as DateTime String
	@IsString()
	@IsNotEmpty()
	@Validate(IsDateString)
	@IsOptional()
	public date: string;
  }
  
  export class CreateManyTicketsDto {
	@IsArray()
	@ArrayMinSize(1)
	@ArrayMaxSize(500)
	public items: CreateTicketDto[];
  }
  