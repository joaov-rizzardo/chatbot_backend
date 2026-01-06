import { CreateSessionDTO } from "../dtos/auth/create-session-dto";
import { Session } from "../entities/session";

export abstract class SessionRepository {
    abstract create(data: CreateSessionDTO): Promise<Session>
    abstract findById(id: string): Promise<Session | null>
}