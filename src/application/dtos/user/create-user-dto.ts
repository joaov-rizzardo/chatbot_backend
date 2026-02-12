import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator'

export class CreateUserDto {
    @ApiProperty({ example: 'João' })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({ example: 'Silva' })
    @IsString()
    @IsNotEmpty()
    lastName: string

    @ApiProperty({ example: 'joao@email.com' })
    @IsEmail()
    email: string

    @ApiProperty({ example: 'senha123', minLength: 8 })
    @IsString()
    @MinLength(8)
    password: string
}
