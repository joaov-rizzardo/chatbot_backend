import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AccessTokenPayload, GenerateAccessTokenInput, RefreshTokenPayload, TokenService } from "src/domain/services/auth/token-service";
import * as jwt from "jsonwebtoken"

@Injectable()
export class JwtTokenService implements TokenService, OnModuleInit {

    private accessTokenSecret: string = ""

    private accessTokenExpirationTime: number = 300000

    private refreshTokenSecret: string = ""

    private refreshTokenExpirationTime: number = 86400000

    constructor(
        private readonly configService: ConfigService
    ) { }

    onModuleInit() {
        this.accessTokenSecret = this.configService.get<string>("ACCESS_TOKEN_SECRET") as string
        this.refreshTokenSecret = this.configService.get<string>("REFRESH_TOKEN_SECRET") as string
        this.accessTokenExpirationTime = this.configService.get<number>("ACCESS_TOKEN_EXPIRATION_TIME_MS") as number
        this.refreshTokenExpirationTime = this.configService.get<number>("REFRESH_TOKEN_EXPIRATION_TIME_MS") as number
    }


    decodeRefreshToken(token: string): RefreshTokenPayload {
        const refreshToken = jwt.decode(token) as jwt.JwtPayload;
        return {
            userId: refreshToken.sub || "",
            sessionId: refreshToken.sessionId
        };
    }

    decodeAccessToken(token: string): AccessTokenPayload {
        const accessToken = jwt.decode(token) as jwt.JwtPayload;
        return {
            sessionId: accessToken.sessionId,
            userId: accessToken.sub || "",
            email: accessToken.email,
            lastName: accessToken.lastName,
            name: accessToken.name,
            workspaceId: accessToken.workspaceId,
            workspaceRole: accessToken.workspaceRole
        };
    }

    generateAccessToken(input: GenerateAccessTokenInput): string {
        return jwt.sign({
            ...input,
            userId: undefined
        }, this.accessTokenSecret, {
            subject: input.userId,
            expiresIn: this.accessTokenExpirationTime
        })
    }

    generateRefreshToken(userId: string, sessionId: string): string {
        return jwt.sign({ sessionId }, this.refreshTokenSecret, {
            subject: userId,
            expiresIn: this.refreshTokenExpirationTime
        })
    }

    checkAccessToken(token: string): boolean {
        try {
            return Boolean(jwt.verify(token, this.accessTokenSecret))
        } catch {
            return false
        }
    }

    checkRefreshToken(token: string): boolean {
        try {
            return Boolean(jwt.verify(token, this.refreshTokenSecret))
        } catch {
            return false
        }
    }

}