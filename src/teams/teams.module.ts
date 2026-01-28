import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { Teams } from './teams';

@Module({
  controllers: [TeamsController],
  providers: [Teams]
})
export class TeamsModule {}
