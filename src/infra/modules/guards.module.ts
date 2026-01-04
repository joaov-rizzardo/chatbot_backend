import { Global, Module } from "@nestjs/common";
import { AuthenticationGuard } from "../guards/authentication.guard";
import { TokenService } from "src/domain/services/auth/token-service";
import { JwtTokenService } from "../security/jwt-token-service";

@Global()
@Module({
    providers: [
        AuthenticationGuard,
        {
            provide: TokenService,
            useClass: JwtTokenService,
        }
    ],
    exports: [
        AuthenticationGuard,
        TokenService
    ]
})
export class GuardsModule { }