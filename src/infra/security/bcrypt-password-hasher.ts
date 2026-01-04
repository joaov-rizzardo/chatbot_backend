import { PasswordHasher } from "src/domain/services/auth/password-hasher";
import bcrypt from "bcrypt"
import { Injectable } from "@nestjs/common";

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {

    async hash(password: string) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt)
    }

    async check(password: string, hashedPassword: string) {
        return bcrypt.compare(password, hashedPassword)
    }
}