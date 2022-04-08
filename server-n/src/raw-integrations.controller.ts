import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/integration')
export class RawIntegrationsController {
  constructor(
    private readonly appService: AppService
  ) {}

  @Get('authorize/:service')
  async getAuthorize(@Req() req, @Res() res): Promise<any> {
    const avilableServices = this.appService.availableServices;
    const { service } = req.params;

    if (service in avilableServices) {
      const authorizeUrl = avilableServices[service].getAuthorizeUrl();
      console.log(authorizeUrl)
      res.redirect(authorizeUrl);
    } else {
      res.status(404).send('Service not found');
    }
  }

  @Post('oauth2/token/:service')
  async getToken(@Req() req, @Res() res): Promise<any> {
    const avilableServices = this.appService.availableServices;
    const { service } = req.params;

    if (service in avilableServices) {
      const token = await avilableServices[service].getToken(req.originalUrl);
      console.log(token);
      res.send(token);
    } else {
      res.status(404).send('Service not found');
    }
  }
}
