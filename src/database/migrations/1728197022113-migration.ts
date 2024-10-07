import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1728197022113 implements MigrationInterface {
  name = 'Migration1728197022113'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`rooms\` (\`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp(6) NULL, \`id\` varchar(36) NOT NULL, \`group_id\` varchar(255) NOT NULL, \`type\` smallint UNSIGNED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`groups\` (\`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp(6) NULL, \`id\` varchar(36) NOT NULL, \`channel_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`channels\` (\`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp(6) NULL, \`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`description\` text NULL, \`is_private\` tinyint NOT NULL, \`creator_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(`ALTER TABLE \`users\` MODIFY \`dob\` date NULL`)
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`)`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`type\` \`type\` smallint UNSIGNED NOT NULL DEFAULT '1'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_1c190b49a6985ebb234adc9e1ea\` FOREIGN KEY (\`group_id\`) REFERENCES \`groups\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`groups\` ADD CONSTRAINT \`FK_f36740312801ce0fdd90eaffba4\` FOREIGN KEY (\`channel_id\`) REFERENCES \`channels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`channels\` ADD CONSTRAINT \`FK_3d0c5303278c3a27aa0179ec55d\` FOREIGN KEY (\`creator_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`channels\` DROP FOREIGN KEY \`FK_3d0c5303278c3a27aa0179ec55d\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`groups\` DROP FOREIGN KEY \`FK_f36740312801ce0fdd90eaffba4\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_1c190b49a6985ebb234adc9e1ea\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`type\` \`type\` smallint NOT NULL DEFAULT '1'`,
    )
    await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\``)
    await queryRunner.query(`ALTER TABLE \`users\` MODIFY \`dob\` varchar(20) NULL`)
    await queryRunner.query(`DROP TABLE \`channels\``)
    await queryRunner.query(`DROP TABLE \`groups\``)
    await queryRunner.query(`DROP TABLE \`rooms\``)
  }
}
