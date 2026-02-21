import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
    workspaceId: string;

    @ApiProperty({ example: 'João' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Silva', required: false })
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty({ example: '5511999999999' })
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty({ example: 'joao@example.com', required: false })
    @IsEmail()
    @IsOptional()
    email?: string;
}
