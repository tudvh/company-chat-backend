import { DataSource, DataSourceOptions } from 'typeorm'
import { SeederOptions } from 'typeorm-extension'

import { getEnv } from '@/common/helpers'
import InitSeeder from './seeders/init.seeder'

const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: getEnv('DB_HOST'),
  port: parseInt(getEnv('DB_PORT')),
  username: getEnv('DB_USERNAME'),
  password: getEnv('DB_PASSWORD'),
  database: getEnv('DB_DATABASE'),
  entities: ['src/**/entities/*.entity.ts'],
  subscribers: ['src/**/subscriber/*.subscriber.ts'],
  migrations: ['src/**/migrations/*.ts'],
  seeds: [InitSeeder],
}

export default new DataSource(dataSourceOptions)
