import { Global, Module } from "@nestjs/common";
import { AuthenticationGuard } from "../guards/authentication.guard";
import { TokenService } from "src/domain/services/auth/token-service";
import { JwtTokenService } from "../security/jwt-token-service";;
import { WorkspaceGuard } from "../guards/workspace.guard";

@Global()
@Module({
    providers: [
        AuthenticationGuard,
        WorkspaceGuard,
        {
            provide: TokenService,
            useClass: JwtTokenService,
        },
    ],
    exports: [
        AuthenticationGuard,
        TokenService,
    ]
})
export class GuardsModule { }