import { Injectable } from '@nestjs/common';
import { DropboxService } from './services/dropbox.controller';
import { GoogleDriveService } from './services/google-drive.controller';

@Injectable()
export class AppService {
  availableServices: {}

  constructor(
    private readonly googleDriveService: GoogleDriveService,
    private readonly dropboxService: DropboxService,
  ) {
    this.availableServices = {
      googleDrive: googleDriveService,
      dropbox: dropboxService,
    }
  }

  json2QueryString(params): string {
    return encodeURI(
      Object.keys(params)
        .map(function (key) {
          return key + "=" + params[key];
        })
        .join("&")
    )
  }

  getHello(): string {
    return 'Hello World!';
  }
}


