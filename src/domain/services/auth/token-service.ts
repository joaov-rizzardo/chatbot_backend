import { WorkspaceMemberRoles } from "src/domain/entities/workspace-member";

export type GenerateAccessTokenInput = {
    sessionId: string;
    userId: string;
    name: string;
    lastName: string;
    email: string;
    workspaceId?: string;
    workspaceRole?: WorkspaceMemberRoles;
}

export type AccessTokenPayload = GenerateAccessTokenInput

export type RefreshTokenPayload = {
    userId: string;
    sessionId: string
}

export abstract class TokenService {
    abstract generateAccessToken(input: GenerateAccessTokenInput): string;
    abstract generateRefreshToken(userId: string, sessionId: string): string;
    abstract checkAccessToken(token: string): boolean;
    abstract checkRefreshToken(token: string): boolean;
    abstract decodeRefreshToken(token: string): RefreshTokenPayload
    abstract decodeAccessToken(token: string): AccessTokenPayload
}