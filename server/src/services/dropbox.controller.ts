import { Injectable } from '@nestjs/common';
import { ITokenResult } from '../interfaces';

require('dotenv').config();

const axios = require("axios");

@Injectable()
export class DropboxService {
  getAuthorizeUrl(): any {
    const clientId = process.env.DRPBX_CLIENT_ID;
    //TODO: move this callback to be the server instead of client
    const callback = `http://localhost:3000/dropbox/callback&response_type=code`;
    return `https://www.dropbox.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${callback}`;
  }

  async getToken(originalUrl): Promise<ITokenResult> {
    const params = new URLSearchParams();
    params.append('code', originalUrl.split('?code=')[1]);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', 'http://localhost:3000/dropbox/callback');
    params.append('client_id', process.env.DRPBX_CLIENT_ID);
    params.append('client_secret', process.env.DRPBX_CLIENT_SECRET);

    const response = await axios.post('https://api.dropboxapi.com/oauth2/token', params)
    console.log(response.data);

    return {
      refresh_token: response.data.refresh_token,
      access_token: response.data.access_token,
      token_type: response.data.token_type,
      expires_in: response.data.expires_in,
      service: 'dropbox',
    };
  }
}
