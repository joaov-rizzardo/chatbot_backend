import { Global, Module } from "@nestjs/common";
import { AuthenticationGuard } from "../guards/authentication.guard";
import { TokenService } from "src/domain/services/auth/token-service";
import { JwtTokenService } from "../security/jwt-token-service";;
import { WorkspaceGuard } from "../guards/workspace.guard";
import { InstanceGuard } from "../guards/instance.guard";
import { InstanceRepository } from "src/domain/repositories/instance.repository";
import { PrismaInstanceRepository } from "../database/prisma/repositories/prisma-instance.repository";

@Global()
@Module({
    providers: [
        AuthenticationGuard,
        WorkspaceGuard,
        InstanceGuard,
        {
            provide: TokenService,
            useClass: JwtTokenService,
        },
        {
            provide: InstanceRepository,
            useClass: PrismaInstanceRepository
        }
    ],
    exports: [
        AuthenticationGuard,
        TokenService,
        InstanceRepository
    ]
})
export class GuardsModule { }