import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team-dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTeamDto) {
    const teamExists = await this.prisma.team.findFirst({
      where: { name: dto.name },
    });

    if (teamExists) {
      throw new BadRequestException('This team name already exists');
    }

    const team = await this.prisma.team.create({
      data: {
        name: dto.name,
        primaryColor: dto.primaryColor,
        secondaryColor: dto.secondaryColor,
      },
    });

    return team;
  }

  async findAll() {
    return this.prisma.team.findMany({
      include: {
        players: true,
      },
    });
  }

  async findById(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
    });

    if (!team) {
      throw new NotFoundException('This Team not exist');
    }
  }
}
