import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match-dto';
import { updateMatchDto } from './dto/update-match-dto';
import { CreateMatchEventDto } from './dto/create-match-event-dto';

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

  async findByTeam(teamId: string) {
    return this.prisma.match.findMany({
      where: { teamId },
      orderBy: { date: 'desc' },
    });
  }

  async update(id: string, data: updateMatchDto) {
    return this.prisma.match.update({
      where: { id },
      data: {
        teamScore: data.teamScore,
        opponentScore: data.opponentScore,
      },
    });
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

  async createEvent(matchId: string, dto: CreateMatchEventDto) {
    return this.prisma.matchEvent.create({
      data: {
        matchId,
        scorerId: dto.scoreId,
        assisterId: dto.assisterId,
      },
      include: {
        scorer: true,
        assister: true,
      },
    });
  }

  async findEvents(matchId: string) {
    return this.prisma.matchEvent.findMany({
      where: { matchId },
      include: {
        scorer: true,
        assister: true,
      },
    });
  }

  async removeEvent(eventId: string) {
    try {
      await this.prisma.matchEvent.delete({
        where: { id: eventId },
      });
    } catch {
      throw new NotFoundException(' Event not found');
    }
  }
}
