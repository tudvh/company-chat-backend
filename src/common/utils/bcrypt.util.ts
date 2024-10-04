import { compare, genSalt, hash } from 'bcryptjs'

export class BcryptUtil {
  static async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    if (!password || !hashedPassword) {
      return false
    }
    try {
      return await compare(password, hashedPassword)
    } catch (error) {
      console.error('Error comparing password and hash:', error)
      return false
    }
  }

  static async hashPassword(password: string): Promise<string> {
    try {
      const salt = await genSalt()
      return await hash(password, salt)
    } catch (error) {
      console.error('Error generating hash:', error)
      throw new Error('Hash generation failed')
    }
  }
}
