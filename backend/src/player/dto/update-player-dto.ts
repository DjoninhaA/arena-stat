import { Position } from '@prisma/client';

export class UpdatePlayerDto {
  name?: string;
  position?: Position;
}
