import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1728359639968 implements MigrationInterface {
  name = 'Migration1728359639968'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`channel_user\` (\`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp(6) NULL, \`channel_id\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL, PRIMARY KEY (\`channel_id\`, \`user_id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `ALTER TABLE \`channel_user\` ADD CONSTRAINT \`FK_d31b165b69b0b23135ce413ce09\` FOREIGN KEY (\`channel_id\`) REFERENCES \`channels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`channel_user\` ADD CONSTRAINT \`FK_a846c7202b4f59da68ad20af060\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`channel_user\` DROP FOREIGN KEY \`FK_a846c7202b4f59da68ad20af060\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`channel_user\` DROP FOREIGN KEY \`FK_d31b165b69b0b23135ce413ce09\``,
    )
    await queryRunner.query(`DROP TABLE \`channel_user\``)
  }
}
