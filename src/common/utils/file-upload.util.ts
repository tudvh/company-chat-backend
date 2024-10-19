import { BadRequestException } from '@nestjs/common'
import * as sharp from 'sharp'

export class UploadUtil {
  static imageFileFilter() {
    return (
      _: Express.Request,
      file: Express.Multer.File,
      callback: (error: Error | null, acceptFile: boolean) => void,
    ) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        callback(new BadRequestException('Only image files are allowed!'), false)
      }
      callback(null, true)
    }
  }

  static async calculateSquareImageSize(
    uploadedFile: Express.Multer.File,
    targetSize: number,
  ): Promise<number> {
    const imageMetadata = await sharp(uploadedFile.buffer).metadata()
    const { width, height } = imageMetadata

    if (width > targetSize && height > targetSize) {
      return targetSize
    }

    return Math.min(width, height)
  }

  static async calculateFreeImageSize(file: Express.Multer.File, maxSize: number) {
    const metadata = await sharp(file.buffer).metadata()
    const { width, height } = metadata

    if (width > maxSize && height > maxSize) {
      return width > height ? { height: maxSize } : { width: maxSize }
    }

    return { width, height }
  }
}
