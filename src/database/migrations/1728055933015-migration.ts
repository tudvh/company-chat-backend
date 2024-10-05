import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1728055933015 implements MigrationInterface {
  name = 'Migration1728055933015'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp(6) NULL, \`id\` varchar(36) NOT NULL, \`first_name\` varchar(20) NOT NULL, \`last_name\` varchar(50) NOT NULL, \`dob\` varchar(20) NULL, \`gender\` tinyint NULL DEFAULT '1', \`phone_number\` varchar(20) NULL, \`avatar_public_id\` varchar(100) NULL, \`avatar_url\` text NULL, \`email\` varchar(100) NOT NULL, \`password\` varchar(255) NULL, \`google_id\` varchar(30) NULL, \`type\` smallint NOT NULL DEFAULT '1', \`is_active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`users\``)
  }
}
