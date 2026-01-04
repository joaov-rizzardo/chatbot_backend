import { CreateUserDto } from "src/application/dtos/create-user-dto";
import { User } from "../entities/user";

export abstract class UserRepository {
    abstract create(user: CreateUserDto): Promise<User>
    abstract findByEmail(email: string): Promise<User | null>
}