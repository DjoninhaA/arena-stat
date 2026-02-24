import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team-dto';
import { UpdateTeamDto } from './dto/update-team-dto';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTeamDto, file: Express.Multer.File | undefined) {
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
        logo: file?.filename,
      },
    });

    return team;
  }

  async update(id: string, dto: UpdateTeamDto) {
    const teamExists = await this.prisma.team.findUnique({
      where: { id },
    });

    if (!teamExists) {
      throw new BadRequestException('This team dont exists');
    }

    const team = await this.prisma.team.update({
      where: { id },
      data: dto,
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

    return team;
  }
}
