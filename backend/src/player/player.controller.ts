import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player-dto';
import { Position } from '@prisma/client';

@Controller('player')
export class PlayerController {
  constructor(private readonly PlayerService: PlayerService) {}

  @Post()
  create(@Body() dto: CreatePlayerDto) {
    return this.PlayerService.create(dto);
  }

  @Get()
  findAll() {
    return this.PlayerService.findAll();
  }

  @Get('position/:position')
  findByPosition(@Param('position') position: Position) {
    return this.PlayerService.findByPosition(position);
  }
}
