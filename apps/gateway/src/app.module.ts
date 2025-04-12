import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAuthGuard } from '../../../libs/shared/guards/firebase-auth.guard';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [HttpModule],
  controllers: [GatewayController],
  providers: [
    { provide: APP_GUARD, useClass: FirebaseAuthGuard },
  ],
})
export class AppModule {}