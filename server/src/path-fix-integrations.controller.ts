import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/path-fix/integration')
export class PathFixIntegrationsController {
  constructor(
    private readonly appService: AppService
  ) {}

  @Get('authorize/:service')
  async getAuthorize(@Req() req, @Res() res): Promise<any> {
    // todo
  }

  @Post('oauth2/token/:service')
  async getToken(@Req() req, @Res() res): Promise<any> {
    // todo
  }
}
