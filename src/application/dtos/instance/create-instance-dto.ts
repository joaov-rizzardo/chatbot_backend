import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInstanceDto {
    workspaceId: string;

    @ApiProperty({ example: 'Minha Instância' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
