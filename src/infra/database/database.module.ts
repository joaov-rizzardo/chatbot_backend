import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { TransactionManager } from "src/domain/services/database/transaction-manager";
import { PrismaTransactionManager } from "./prisma/prisma-transaction-manager";

@Global()
@Module({
    providers: [
        PrismaService,
        {
            provide: TransactionManager,
            useClass: PrismaTransactionManager
        }
    ],
    exports: [PrismaService, TransactionManager]
})
export class DatabaseModule { }