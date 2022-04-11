import { Injectable } from '@nestjs/common';
import { ITokenResult } from '../interfaces';

require('dotenv').config();

const { google } = require('googleapis');
const { json2QueryString } = require('../helpers');

const URLS = {
  client: 'http://localhost:3000',
  googleRedirect: `http://localhost:3000/googleDrive/callback`,
};

// http://localhost:3000/integration/oauth2/token/googleDrive
const oauth2Client = new google.auth.OAuth2(
  process.env.GGLED_CLIENT_ID,
  process.env.GGLED_CLIENT_SECRET,
  URLS.googleRedirect,
);

@Injectable()
export class GoogleDriveService {

  getAuthorizeUrl(req, res): any {
    console.log(process.env)
    const params = {
      client_id: process.env.GGLED_CLIENT_ID,
      redirect_uri: URLS.googleRedirect,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/adexchange.buyer',
      include_granted_scopes: 'true',
      state: 'pass-through value',
    };
    return `https://accounts.google.com/o/oauth2/v2/auth?${json2QueryString(params)}`
  }

  async getToken(originalUrl): Promise<ITokenResult> {

    // Gambi because of POC - life
    const url = new URL(`http://localhost/${originalUrl}`);
    const params = new URLSearchParams(url.search);
    const code = params.get('code');

    if (!code) {
      throw new Error('code not defined')
    }

    // Get access and refresh tokens (if access_type is offline)
    let { tokens } = await oauth2Client.getToken({ code });

    console.log(tokens);

    return {
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token,
      token_type: tokens.token_type,
      expires_in: tokens.expires_in,
      service: 'googleDrive',
      client_id: process.env.GGLED_CLIENT_ID,
    };
  }
}
