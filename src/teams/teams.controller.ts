import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team-dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamService: TeamsService) {}

  @Post()
  create(@Body() dto: CreateTeamDto) {
    return this.teamService.create(dto);
  }

  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  @Get()
  findById(@Param(':id') id: string) {
    return this.teamService.findById(id);
  }
}
