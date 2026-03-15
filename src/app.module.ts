import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './infra/database/database.module';
import { UserModule } from './infra/modules/user.module';
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from './infra/modules/auth.module';
import { GuardsModule } from './infra/modules/guards.module';
import { WorkspaceModule } from './infra/modules/workspace.module';
import { InstanceModule } from './infra/modules/instance.module';
import { ContactModule } from './infra/modules/contact.module';
import { TagModule } from './infra/modules/tag.module';
import { ContactTagModule } from './infra/modules/contact-tag.module';
import { ConversationModule } from './infra/modules/conversation.module';
import { MessageModule } from './infra/modules/message.module';
import { MessagingModule } from './infra/messaging/messaging.module';
import { StorageModule } from './infra/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DatabaseModule,
    StorageModule,
    MessagingModule,
    GuardsModule,
    AuthModule,
    UserModule,
    WorkspaceModule,
    InstanceModule,
    ContactModule,
    TagModule,
    ContactTagModule,
    ConversationModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
