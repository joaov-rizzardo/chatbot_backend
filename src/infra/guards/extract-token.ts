export function extractToken(request: any): string | null {
    const authHeader: string | undefined = request.headers?.['authorization'];
    if (authHeader) {
        const [bearer, token] = authHeader.split(' ');
        if (bearer === 'Bearer' && token) {
            return token;
        }
    }

    const cookieToken: string | undefined = request.cookies?.['access_token'];
    if (cookieToken) {
        return cookieToken;
    }

    return null;
}
