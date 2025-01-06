import cloudinary from 'cloudinary';
import { env } from './env.js';
import fs from 'node:fs/promises';

cloudinary.v2.config({
  cloud_name: env('CLOUD_NAME'),
  api_key: env('API_KEY'),
  api_secret: env('API_SECRET'),
  secure: true,
});

export const saveFileToCloudinary = async (file) => {
  const result = await cloudinary.v2.uploader.upload(file.path);
  await fs.unlink(file.path); // Удаляем файл из локального хранилища
  return result.secure_url; // Возвращаем URL загруженного файла
};
