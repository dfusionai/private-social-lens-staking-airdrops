import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCheckpointTable1747110393083 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing checkpoint table if it exists
    await queryRunner.query(`DROP TABLE IF EXISTS "checkpoint"`);

    // Create checkpoint table
    await queryRunner.query(`
            CREATE TABLE "checkpoint" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "blockNumber" integer NOT NULL,
                "timestamp" integer NOT NULL,
                "processedAt" TIMESTAMP NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_checkpoint" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop checkpoint table
    await queryRunner.query(`DROP TABLE IF EXISTS "checkpoint"`);
  }
}
