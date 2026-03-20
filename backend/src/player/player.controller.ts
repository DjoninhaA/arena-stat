import {
  Body,
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player-dto';
import { Position } from '@prisma/client';
import { UpdatePlayerDto } from './dto/update-player-dto';

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

  @Get(':id/events')
  findEvents(@Param('id') id: string) {
    return this.PlayerService.findEvents(id);
  }

  @Get(':id/stats')
  findStats(@Param('id') id: string) {
    return this.PlayerService.findStats(id);
  }

  @Get(':id')
  findByid(@Param('id') id: string) {
    return this.PlayerService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdatePlayerDto) {
    return this.PlayerService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.PlayerService.delete(id);
  }
}
