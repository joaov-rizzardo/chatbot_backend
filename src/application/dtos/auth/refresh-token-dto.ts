import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    MinLength,
} from 'class-validator'

export class RefreshTokenDTO {
    @ApiProperty({ description: 'Refresh token JWT' })
    @IsString()
    @MinLength(1)
    refreshToken: string
}
