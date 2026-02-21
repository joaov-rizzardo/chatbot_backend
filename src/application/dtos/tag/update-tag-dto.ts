import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTagDto {
    @ApiProperty({ example: 'VIP', required: false })
    @IsString()
    @IsOptional()
    @MaxLength(30)
    name?: string;

    @ApiProperty({ example: 'emerald', required: false })
    @IsString()
    @IsOptional()
    color?: string;

    @ApiProperty({ example: 'Clientes de alto valor', required: false })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    description?: string | null;
}
