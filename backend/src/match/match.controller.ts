import {
  Body,
  Controller,
  Param,
  Post,
  Patch,
  Get,
  Delete,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match-dto';
import { updateMatchDto } from './dto/update-match-dto';
import { CreateMatchEventDto } from './dto/create-match-event-dto';

@Controller('match')
export class MatchController {
  constructor(private readonly MatchService: MatchService) {}

  @Post(':teamId')
  create(@Param('teamId') teamId: string, @Body() dto: CreateMatchDto) {
    return this.MatchService.create(teamId, dto);
  }

  @Get()
  findAll() {
    return this.MatchService.findAll();
  }

  @Get('team/:teamId')
  findByTeam(@Param('teamId') teamId: string) {
    return this.MatchService.findByTeam(teamId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: updateMatchDto) {
    return this.MatchService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.MatchService.remove(id);
  }

  @Post(':matchId/event')
  createEvent(
    @Param('matchId') matchId: string,
    @Body() dto: CreateMatchEventDto,
  ) {
    return this.MatchService.createEvent(matchId, dto);
  }

  @Get(':matchId/event')
  findEvents(@Param('matchId') matchId: string) {
    return this.MatchService.findEvents(matchId);
  }

  @Delete(':matchId/event/:eventId')
  removeEvent(@Param('eventId') eventId: string) {
    return this.MatchService.removeEvent(eventId);
  }
}
