export abstract class TokenService {
    abstract generateAccessToken(userId: string): string;
}