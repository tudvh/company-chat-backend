import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1734275646356 implements MigrationInterface {
  name = 'Migration1734275646356'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`messages\` ADD \`sender_id\` varchar(255) NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_f670935e6d8577490e36d689638\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`messages\` CHANGE \`reply_id\` \`reply_id\` varchar(255) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_22133395bd13b970ccd0c34ab22\` FOREIGN KEY (\`sender_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_f670935e6d8577490e36d689638\` FOREIGN KEY (\`reply_id\`) REFERENCES \`messages\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_f670935e6d8577490e36d689638\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_22133395bd13b970ccd0c34ab22\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`messages\` CHANGE \`reply_id\` \`reply_id\` varchar(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_f670935e6d8577490e36d689638\` FOREIGN KEY (\`reply_id\`) REFERENCES \`messages\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`sender_id\``)
  }
}
