import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
	  const ctx = host.switchToHttp();
	  const response = ctx.getResponse<Response>();
	  const status =
		exception instanceof HttpException
		  ? exception.getStatus()
		  : HttpStatus.INTERNAL_SERVER_ERROR;
  
	  response.status(status).json({
		statusCode: status,
		message: exception.message, // This will include the real error message.
	  });
	}
  }
  