import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1729871759815 implements MigrationInterface {
    name = 'Migration1729871759815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`channel_invites\` DROP FOREIGN KEY \`FK_6fd627687a4ab7546b3fb1a4123\``);
        await queryRunner.query(`ALTER TABLE \`channel_invites\` DROP COLUMN \`channelId\``);
        await queryRunner.query(`ALTER TABLE \`channel_invites\` ADD CONSTRAINT \`FK_9e26326f86289b9e6ead57c1adf\` FOREIGN KEY (\`channel_id\`) REFERENCES \`channels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`channel_invites\` DROP FOREIGN KEY \`FK_9e26326f86289b9e6ead57c1adf\``);
        await queryRunner.query(`ALTER TABLE \`channel_invites\` ADD \`channelId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`channel_invites\` ADD CONSTRAINT \`FK_6fd627687a4ab7546b3fb1a4123\` FOREIGN KEY (\`channelId\`) REFERENCES \`channels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
