import {
  Body,
  Controller,
  Post,
  Put,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team-dto';
import { UpdateTeamDto } from './dto/update-team-dto';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  create(@Body() dto: CreateTeamDto, @UploadedFile() file: Express.Multer.File) {
    return this.teamService.create(dto, file);
  }

  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.teamService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateTeamDto) {
    return this.teamService.update(id, data);
  }
}
