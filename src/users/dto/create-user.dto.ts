import { IsEmail, IsString, IsNotEmpty, MinLength, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    name?: string;
}
