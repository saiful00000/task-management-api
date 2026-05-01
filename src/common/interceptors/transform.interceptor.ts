import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// This is the shape our Frontend expects!
export interface Response<T> {
    statusCode: number;
    message: string;
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        // We grab the actual HTTP response status code
        const response = context.switchToHttp().getResponse();

        // We take the raw data returned by the Controller, and wrap it!
        return next.handle().pipe(
            map(data => ({
                statusCode: response.statusCode,
                message: 'Request successful',
                data: data || null,
            })),
        );
    }
}
