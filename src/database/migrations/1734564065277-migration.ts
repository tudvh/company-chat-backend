import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1734564065277 implements MigrationInterface {
  name = 'Migration1734564065277'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`message_attachments\` (\`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp(6) NULL, \`id\` varchar(36) NOT NULL, \`message_id\` varchar(255) NOT NULL, \`public_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `ALTER TABLE \`message_attachments\` ADD CONSTRAINT \`FK_bf65c3db8657cef6197b68b8c88\` FOREIGN KEY (\`message_id\`) REFERENCES \`messages\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`message_attachments\` DROP FOREIGN KEY \`FK_bf65c3db8657cef6197b68b8c88\``,
    )
    await queryRunner.query(`DROP TABLE \`message_attachments\``)
  }
}
