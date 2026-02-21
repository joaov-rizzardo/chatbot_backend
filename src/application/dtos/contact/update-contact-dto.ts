import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateContactDto {
    @ApiProperty({ example: 'João', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'Silva', required: false })
    @IsString()
    @IsOptional()
    lastName?: string | null;

    @ApiProperty({ example: 'joao@example.com', required: false })
    @IsEmail()
    @IsOptional()
    email?: string | null;
}
