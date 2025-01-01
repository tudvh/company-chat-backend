import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1734861877948 implements MigrationInterface {
  name = 'Migration1734861877948'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`message_attachments\` ADD \`file_name\` varchar(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`message_attachments\` ADD \`file_type\` varchar(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`message_attachments\` CHANGE \`public_id\` \`public_id\` varchar(255) NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`message_attachments\` CHANGE \`public_id\` \`public_id\` varchar(255) NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE \`message_attachments\` DROP COLUMN \`file_type\``)
    await queryRunner.query(`ALTER TABLE \`message_attachments\` DROP COLUMN \`file_name\``)
  }
}
