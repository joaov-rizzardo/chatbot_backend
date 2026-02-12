import { Body, Controller, HttpCode, Post, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RefreshTokenDTO } from "src/application/dtos/auth/refresh-token-dto";
import { UserLoginDTO } from "src/application/dtos/auth/user-login-dto";
import { RefreshTokenUseCase } from "src/application/use-cases/auth/refresh-token-use-case";
import { UserLoginUseCase } from "src/application/use-cases/auth/user-login-use-case";
import { BadCredentialsError } from "src/domain/errors/auth/bad-credentials-error";
import { InvalidRefreshTokenError } from "src/domain/errors/auth/invalid-refresh-token-error";

@ApiTags('auth')
@Controller("auth")
export class AuthController {

    constructor(
        private readonly userLoginUseCase: UserLoginUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase
    ) { }

    @HttpCode(200)
    @Post("refresh")
    @ApiOperation({ summary: 'Renovar access token' })
    @ApiResponse({ status: 200, description: 'Novo par de tokens' })
    @ApiResponse({ status: 401, description: 'Refresh token inválido' })
    async refresh(@Body() { refreshToken }: RefreshTokenDTO) {
        try {
            const result = await this.refreshTokenUseCase.execute({ refreshToken })
            return result
        } catch (error) {
            if (error instanceof InvalidRefreshTokenError) {
                throw new UnauthorizedException({
                    code: error.code,
                    message: error.message
                })
            }
            throw error
        }
    }

    @HttpCode(200)
    @Post("login")
    @ApiOperation({ summary: 'Login (email e senha)' })
    @ApiResponse({ status: 200, description: 'Tokens e dados da sessão' })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
    async login(@Body() { email, password }: UserLoginDTO) {
        try {
            const result = await this.userLoginUseCase.execute({ email, password })
            return result
        } catch (error) {
            if (error instanceof BadCredentialsError) {
                throw new UnauthorizedException({
                    code: error.code,
                    message: error.message
                })
            }
            throw error
        }
    }
}