import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('You must be logged in to access this');
        }

        try {
            // Cryptographically verify the badge!
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET || 'development_secret'
            });

            // Attach the decoded payload to the request object so our controllers can use it!
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
        return true; // Let them through!
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
