import { Position } from '@prisma/client';

export class CreatePlayerDto {
  name: string;
  position: Position;
  teamId: string;
}
