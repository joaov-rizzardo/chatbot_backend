export abstract class PasswordHasher {
    abstract hash(password: string): string | Promise<string>;
    abstract check(password: string, hashedPassword: string): boolean | Promise<boolean>;
}