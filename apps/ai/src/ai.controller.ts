import { Controller, Post, Body } from '@nestjs/common';
import * as dotenv from 'dotenv';
import {AiService} from "./ai.service";
dotenv.config();

// https://console.groq.com/docs/models
export interface TotwReq {
  players: any[],
  teamSize: number,
}
@Controller('team-of-the-week')
export class AiController {

  constructor(private readonly aiService: AiService) {}

  @Post()
  async teamOfTheWeek(@Body() totwReq: TotwReq) {
    return this.aiService.getTeamOfTheWeek(totwReq);
  }
}
