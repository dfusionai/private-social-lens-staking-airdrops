import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRewardJobTable1747110635793 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing reward_job table if it exists
    await queryRunner.query(`DROP TABLE IF EXISTS "reward_job"`);

    // Create reward_job table
    await queryRunner.query(`
            CREATE TABLE "reward_job" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "recipientAddress" character varying NOT NULL,
                "checkpointId" uuid NOT NULL,
                "stakeIndex" bigint NOT NULL,
                "amount" numeric NOT NULL,
                "duration" integer NOT NULL,
                "rewardPercentage" numeric NOT NULL,
                "rewardAmount" numeric NOT NULL,
                "status" character varying NOT NULL,
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
