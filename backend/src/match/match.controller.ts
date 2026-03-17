import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match-dto';

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
}
