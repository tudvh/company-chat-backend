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
        callback(new BadRequestException('Chỉ cho phép các tệp hình ảnh!'), false)
        return
      }
      callback(null, true)
    }
  }

  static messageAttachmentFilter() {
    return (
      _: Express.Request,
      file: Express.Multer.File,
      callback: (error: Error | null, acceptFile: boolean) => void,
    ) => {
      const allowedMimeTypes = [
        'image/jpg',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
      ]
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(
          new BadRequestException(
            `Loại tệp "${file.mimetype}" không được hỗ trợ! Chỉ chấp nhận các tệp hình ảnh và tài liệu.`,
          ),
          false,
        )
      }

      const maxSizeInBytes = 2 * 1024 * 1024
      if (file.size > maxSizeInBytes) {
        return callback(
          new BadRequestException(
            `Kích thước tệp vượt quá 2MB! Kích thước hiện tại: ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
          ),
          false,
        )
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
