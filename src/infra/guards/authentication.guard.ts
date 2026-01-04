import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { InvalidAccessTokenError } from "src/domain/errors/auth/invalid-access-token-error";
import { AccessTokenPayload, TokenService } from "src/domain/services/auth/token-service";

export interface UserRequest extends Request, AccessTokenPayload { }

@Injectable()
export class AuthenticationGuard implements CanActivate {

    constructor(
        private readonly tokenService: TokenService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        let request = context.switchToHttp().getRequest<UserRequest>();
        try {
            const authHeader = request.headers['authorization'];
            if (!authHeader) {
                throw new InvalidAccessTokenError()
            }

            const [bearer, token] = authHeader.split(' ');
            if (bearer !== 'Bearer' || !token) {
                throw new InvalidAccessTokenError()
            }
            if (!this.tokenService.checkAccessToken(token)) {
                throw new InvalidAccessTokenError()
            }
            const decodedToken = this.tokenService.decodeAccessToken(token)
            Object.entries(decodedToken).forEach(([key, value]) => request[key] = value)
            return true
        } catch (error) {
            if (error instanceof InvalidAccessTokenError) {
                throw new UnauthorizedException({
                    code: error.code,
                    message: error.message
                })
            }
            throw error
        }
    }

}