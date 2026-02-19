import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { PlayerService } from './player/player.service';
import { PlayerController } from './player/player.controller';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [PrismaModule, UsersModule, TeamsModule, PlayerModule],
  controllers: [AppController, PlayerController],
  providers: [AppService, PlayerService],
})
export class AppModule {}
