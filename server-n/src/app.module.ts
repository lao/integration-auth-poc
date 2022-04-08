import { Module } from '@nestjs/common';
import { RawIntegrationsController } from './raw-integrations.controller';
import { AppService } from './app.service';
import { GoogleDriveService } from './services/google-drive.controller';
import { DropboxService } from './services/dropbox.controller';

@Module({
  imports: [],
  controllers: [RawIntegrationsController],
  providers: [AppService, GoogleDriveService, DropboxService],
})
export class AppModule {}
