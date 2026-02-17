import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateInstanceDto {
    instanceName: string;

    @ApiProperty({ example: 'Minha Instância' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
