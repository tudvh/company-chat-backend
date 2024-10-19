import { config } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'
import { SeederOptions } from 'typeorm-extension'

import InitSeeder from './seeders/init.seeder'

config()

const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/entities/*.entity.ts'],
  subscribers: ['src/**/subscriber/*.subscriber.ts'],
  migrations: ['src/**/migrations/*.ts'],
  seeds: [InitSeeder],
}

export default new DataSource(dataSourceOptions)
