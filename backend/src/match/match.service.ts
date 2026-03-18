import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match-dto';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async create(teamId: string, dto: CreateMatchDto) {
    const match = await this.prisma.match.create({
      data: {
        teamId,
        opponentName: dto.opponentName,
        date: dto.date,
      },
    });
    return match;
  }

  async findAll() {
    return this.prisma.match.findMany();
  }

  async remove(id: string) {
    try {
      await this.prisma.match.delete({
        where: { id },
      });

      return {
        message: 'Match deleted successfully',
      };
    } catch {
      throw new NotFoundException('Match not found');
    }
  }
}
