import { getEnv } from '../helpers'

export const IMAGE_FORMAT = {
  CHANNEL_THUMBNAIL: 'webp',
}

export const IMAGE_SIZE = {
  CHANNEL_THUMBNAIL: 256,
}

export const FOLDER_PATH = {
  CHANNEL_THUMBNAIL: `${getEnv('CLOUDINARY_ROOT_FOLDER')}/images/channel-thumbnails`,
}

export const URL_EXPIRATION = {
  CHANNEL_THUMBNAIL: 60 * 60 * 24,
}
