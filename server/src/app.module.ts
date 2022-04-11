import { Module } from '@nestjs/common';
import { RawIntegrationsController } from './raw-integrations.controller';
import { AppService } from './app.service';
import { GoogleDriveService } from './services/google-drive.controller';
import { DropboxService } from './services/dropbox.controller';
import { PathFixIntegrationsController } from './path-fix-integrations.controller';

@Module({
  imports: [],
  controllers: [RawIntegrationsController, PathFixIntegrationsController],
  providers: [AppService, GoogleDriveService, DropboxService],
})
export class AppModule {}
