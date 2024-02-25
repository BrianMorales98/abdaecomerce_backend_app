//Service for Pirsma ORM (Service contiene toda la logica de los modulos, en este caso solo extiende las tablas de prismaClient que contiene la migracion de la base de datos)

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }
}