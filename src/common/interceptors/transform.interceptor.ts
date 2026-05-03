import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    status: boolean;
    message: string;
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor(private reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const response = context.switchToHttp().getResponse();
        const customMessage = this.reflector.get<string>('response_message', context.getHandler());

        return next.handle().pipe(
            map(data => ({
                status: true,
                message: customMessage || 'Request successful',
                data: data || null,
            })),
        );
    }
}
