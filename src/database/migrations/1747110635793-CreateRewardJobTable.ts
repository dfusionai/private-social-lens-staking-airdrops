import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCheckpointAndRewardJobTables1234567890123
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing reward_job table if it exists
    await queryRunner.query(`DROP TABLE IF EXISTS "reward_job"`);

    // Create reward_job table
    await queryRunner.query(`
            CREATE TABLE "reward_job" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "walletAddress" character varying NOT NULL,
                "amount" numeric NOT NULL,
                "startTime" integer NOT NULL,
                "duration" integer NOT NULL,
                "hasWithdrawn" boolean NOT NULL DEFAULT false,
                "withdrawalTime" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_reward_job" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop reward_job table
    await queryRunner.query(`DROP TABLE IF EXISTS "reward_job"`);
  }
}
