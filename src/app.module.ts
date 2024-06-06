import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EncryptionController } from './encryption/encryption.controller';
import { EncryptionService } from './encryption/encryption.service';

@Module({
  imports: [],
  controllers: [AppController, EncryptionController],
  providers: [AppService, EncryptionService],
})
export class AppModule {}
