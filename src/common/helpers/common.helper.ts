import { config } from 'dotenv'
import * as crypto from 'crypto'

config()

export const getEnv = (key: string): string => {
  const value = process.env[key]
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`)
  }
  return value
}

export const uuidToInt = (uuid: string) => {
  const hash = crypto.createHash('sha256').update(uuid).digest('hex')
  return parseInt(hash.slice(0, 8), 16)
}
