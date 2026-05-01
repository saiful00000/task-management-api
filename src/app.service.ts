import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {


  constructor(private configService: ConfigService) { }

  getHello(): string {
    const secret = this.configService.get<string>('TEST_SECRET')
    return `Wellcome to Task Management! our secret is ${secret}`;
  }
}