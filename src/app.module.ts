import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './infra/database/database.module';
import { UserModule } from './infra/modules/user.module';
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from './infra/modules/auth.module';
import { GuardsModule } from './infra/modules/guards.module';
import { WorkspaceModule } from './infra/modules/workspace.module';
import { InstanceModule } from './infra/modules/instance.module';
import { MessagingModule } from './infra/messaging/messaging.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DatabaseModule,
    MessagingModule,
    GuardsModule,
    AuthModule,
    UserModule,
    WorkspaceModule,
    InstanceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
