import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TeamModule } from './team/team.module';
import { PlayerService } from './player/player.service';
import { PlayerController } from './player/player.controller';
import { PlayerModule } from './player/player.module';
import { MatchModule } from './match/match.module';
import { MatchService } from './match/match.service';
import { MatchController } from './match/match.controller';

@Module({
  imports: [PrismaModule, UsersModule, TeamModule, PlayerModule, MatchModule],
  controllers: [AppController, PlayerController, MatchController],
  providers: [AppService, PlayerService, MatchService],
})
export class AppModule {}
