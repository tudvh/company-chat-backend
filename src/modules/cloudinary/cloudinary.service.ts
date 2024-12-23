import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary'

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    })
  }

  public async uploadFile(
    file: Express.Multer.File,
    uploadOptions?: UploadApiOptions,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) {
            return reject(error)
          }
          resolve(result)
        })
        .end(file.buffer)
    })
  }

  public generateSignedUrl(
    publicId: string,
    expirationInSeconds: number,
    resourceType: 'image' | 'video' | 'raw' = 'image',
  ): string {
    const urlOptions = {
      resource_type: resourceType,
      type: 'authenticated',
      sign_url: true,
      secure: true,
      expires_at: Math.floor(Date.now() / 1000) + expirationInSeconds,
    }
    return cloudinary.url(publicId, urlOptions)
  }
}
