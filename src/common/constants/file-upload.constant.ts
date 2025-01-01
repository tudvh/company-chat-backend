import { getEnv } from '../helpers'

export const IMAGE_FORMAT = {
  CHANNEL_THUMBNAIL: 'webp',
}

export const IMAGE_SIZE = {
  CHANNEL_THUMBNAIL: 256,
}

export const FOLDER_PATH = {
  CHANNEL_THUMBNAIL: `${getEnv('CLOUDINARY_ROOT_FOLDER')}/images/channel-thumbnails`,
  MESSAGE_ATTACHMENT: `${getEnv('CLOUDINARY_ROOT_FOLDER')}/files/message-attachments`,
}

export const URL_EXPIRATION = {
  CHANNEL_THUMBNAIL: 60 * 60 * 24,
  USER_AVATAR: 60 * 60 * 24,
  MESSAGE_ATTACHMENT: 60 * 60 * 24,
}
