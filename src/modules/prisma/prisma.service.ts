// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { PrismaPg } from '@prisma/adapter-pg';
// import { PrismaClient } from '@prisma/client';
// import { Pool } from 'pg';

// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit {
//   private pool: Pool;
//   constructor() {
//     const pool = new Pool({
//       connectionString: process.env.DATABASE_URL,
//     });
//     super({
//       adapter: new PrismaPg(pool),
//     });

//     this.pool = pool;
//   }

//   async onModuleInit() {
//     await this.$connect();
//   }

//   async onApplicationShutdown() {
//     await this.$disconnect();
//     // Isso é necessário para os testes e2e.
//     await this.pool.end();
//   }
// }

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }

  async onModuleInit() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL não definida');
    }

    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
