import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTagDto {
    workspaceId: string;

    @ApiProperty({ example: 'VIP' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    name: string;

    @ApiProperty({ example: 'emerald' })
    @IsString()
    @IsNotEmpty()
    color: string;

    @ApiProperty({ example: 'Clientes de alto valor', required: false })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    description?: string;
}
