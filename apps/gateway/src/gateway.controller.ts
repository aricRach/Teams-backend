import {Body, Controller, Get, Post, Req} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as dotenv from "dotenv";
dotenv.config();

@Controller()
export class GatewayController {
  constructor(private readonly http: HttpService) {}

  @Post('team-of-the-week')
  async getBalance(@Body() body: any, @Req() req: any) {
    const token = req.headers['authorization'];
    const aiUrl = process.env.AI_SERVICE_URL || '';
      console.log('ai url', aiUrl)
    const response = await lastValueFrom(
        this.http.post(aiUrl, body, {
          headers: {
            Authorization: token,
          },
        }),
    );


    return response.data;
  }
}