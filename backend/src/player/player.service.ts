import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player-dto';
import { Position } from '@prisma/client';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePlayerDto) {
    const player = await this.prisma.player.create({
      data: {
        name: dto.name,
        position: dto.position,
        team: {
          connect: { id: dto.teamId },
        },
      },
    });

    return player;
  }

  async findAll() {
    return this.prisma.player.findMany();
  }

  async findById(id: string) {
    const player = await this.prisma.player.findUnique({
      where: { id },
    });

    if (!player) {
      throw new NotFoundException('This Player not exist');
    }
  }

  async findByPosition(position: Position) {
    const player = await this.prisma.player.findMany({
      where: { position: position },
    });

    if (!player) {
      throw new NotFoundException('No players found for this position');
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.player.delete({
        where: { id },
      });

      return {
        message: 'Player deleted successfully',
      };
    } catch {
      throw new NotFoundException('Player not found');
    }
  }
}
