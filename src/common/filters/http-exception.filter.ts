import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

// The @Catch decorator tells NestJS to send all HTTP errors to this file
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        // Sometimes NestJS errors are strings, sometimes they are objects (like validation errors)
        const exceptionResponse = exception.getResponse() as any;
        const message = typeof exceptionResponse === 'string'
            ? exceptionResponse
            : exceptionResponse.message;

        response
            .status(status)
            .json({
                status: false,
                message: Array.isArray(message) ? message.join(', ') : message,
                data: null,
            });
    }
}
