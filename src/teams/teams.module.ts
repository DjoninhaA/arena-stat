import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { Teams } from './teams';
import { TeamsService } from './teams.service';
import { TeamsService } from './teams.service';

@Module({
  controllers: [TeamsController],
  providers: [Teams, TeamsService]
})
export class TeamsModule {}
