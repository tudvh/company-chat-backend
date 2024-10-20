import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1729177740316 implements MigrationInterface {
  name = 'Migration1729177740316'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`channel_invites\` (\`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp(6) NULL, \`id\` varchar(36) NOT NULL, \`channel_id\` varchar(255) NOT NULL, \`expires_time\` datetime NOT NULL, \`channelId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp(6) NULL, \`id\` varchar(36) NOT NULL, \`full_name\` varchar(100) NOT NULL, \`dob\` date NULL, \`gender\` tinyint NULL DEFAULT '1', \`phone_number\` varchar(20) NULL, \`avatar_public_id\` varchar(100) NULL, \`avatar_url\` text NULL, \`email\` varchar(100) NOT NULL, \`password\` varchar(255) NULL, \`google_id\` varchar(30) NULL, \`type\` smallint UNSIGNED NOT NULL DEFAULT '1', \`is_active\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`channel_user\` (\`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp(6) NULL, \`channel_id\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`is_creator\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`channel_id\`, \`user_id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`channels\` (\`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp(6) NULL, \`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`description\` text NULL, \`thumbnail_public_id\` varchar(100) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`groups\` (\`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp(6) NULL, \`id\` varchar(36) NOT NULL, \`channel_id\` varchar(255) NOT NULL, \`name\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`messages\` (\`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp(6) NULL, \`id\` varchar(36) NOT NULL, \`room_id\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`reply_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`rooms\` (\`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` timestamp(6) NULL, \`id\` varchar(36) NOT NULL, \`group_id\` varchar(255) NULL, \`name\` varchar(100) NOT NULL, \`type\` smallint UNSIGNED NOT NULL, \`is_private\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`room_user\` (\`user_id\` varchar(36) NOT NULL, \`room_id\` varchar(36) NOT NULL, INDEX \`IDX_48e3504326b5bb6aba15d119a1\` (\`user_id\`), INDEX \`IDX_90d278bf002394670a9b557fce\` (\`room_id\`), PRIMARY KEY (\`user_id\`, \`room_id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `ALTER TABLE \`channel_invites\` ADD CONSTRAINT \`FK_6fd627687a4ab7546b3fb1a4123\` FOREIGN KEY (\`channelId\`) REFERENCES \`channels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`channel_user\` ADD CONSTRAINT \`FK_d31b165b69b0b23135ce413ce09\` FOREIGN KEY (\`channel_id\`) REFERENCES \`channels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`channel_user\` ADD CONSTRAINT \`FK_a846c7202b4f59da68ad20af060\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`groups\` ADD CONSTRAINT \`FK_f36740312801ce0fdd90eaffba4\` FOREIGN KEY (\`channel_id\`) REFERENCES \`channels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_1dda4fc8dbeeff2ee71f0088ba0\` FOREIGN KEY (\`room_id\`) REFERENCES \`rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_f670935e6d8577490e36d689638\` FOREIGN KEY (\`reply_id\`) REFERENCES \`messages\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_1c190b49a6985ebb234adc9e1ea\` FOREIGN KEY (\`group_id\`) REFERENCES \`groups\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`room_user\` ADD CONSTRAINT \`FK_48e3504326b5bb6aba15d119a11\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE \`room_user\` ADD CONSTRAINT \`FK_90d278bf002394670a9b557fcef\` FOREIGN KEY (\`room_id\`) REFERENCES \`rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`room_user\` DROP FOREIGN KEY \`FK_90d278bf002394670a9b557fcef\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`room_user\` DROP FOREIGN KEY \`FK_48e3504326b5bb6aba15d119a11\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_1c190b49a6985ebb234adc9e1ea\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_f670935e6d8577490e36d689638\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_1dda4fc8dbeeff2ee71f0088ba0\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`groups\` DROP FOREIGN KEY \`FK_f36740312801ce0fdd90eaffba4\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`channel_user\` DROP FOREIGN KEY \`FK_a846c7202b4f59da68ad20af060\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`channel_user\` DROP FOREIGN KEY \`FK_d31b165b69b0b23135ce413ce09\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`channel_invites\` DROP FOREIGN KEY \`FK_6fd627687a4ab7546b3fb1a4123\``,
    )
    await queryRunner.query(`DROP INDEX \`IDX_90d278bf002394670a9b557fce\` ON \`room_user\``)
    await queryRunner.query(`DROP INDEX \`IDX_48e3504326b5bb6aba15d119a1\` ON \`room_user\``)
    await queryRunner.query(`DROP TABLE \`room_user\``)
    await queryRunner.query(`DROP TABLE \`rooms\``)
    await queryRunner.query(`DROP TABLE \`messages\``)
    await queryRunner.query(`DROP TABLE \`groups\``)
    await queryRunner.query(`DROP TABLE \`channels\``)
    await queryRunner.query(`DROP TABLE \`channel_user\``)
    await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``)
    await queryRunner.query(`DROP TABLE \`users\``)
    await queryRunner.query(`DROP TABLE \`channel_invites\``)
  }
}
