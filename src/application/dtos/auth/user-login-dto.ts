import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsString,
    MinLength,
} from 'class-validator'

export class UserLoginDTO {
    @ApiProperty({ example: 'usuario@email.com' })
    @IsEmail()
    email: string

    @ApiProperty({ example: 'senha123', minLength: 8 })
    @IsString()
    @MinLength(8)
    password: string
}
