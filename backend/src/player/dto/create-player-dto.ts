import { Position } from '@prisma/client';

export class CreatePlayerDto {
  name: string;
  number?: number;
  position: Position;
  teamId: string;
}
