import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { env } from './env.js';

// Функция для сохранения файла в локальную директорию
export const saveFileToUploadDir = async (file) => {
  try {
    // Создаем папку UPLOAD_DIR, если она не существует
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const tempFilePath = path.join(TEMP_UPLOAD_DIR, file.filename);
    const uploadFilePath = path.join(UPLOAD_DIR, file.filename);

    // Перемещаем файл из временной директории в директорию для загрузок
    await fs.rename(tempFilePath, uploadFilePath);

    // Возвращаем URL сохраненного файла
    return `${env('APP_DOMAIN')}/uploads/${file.filename}`;
  } catch (error) {
    console.error('Error saving file to upload directory:', error.message);
    throw new Error('Failed to save file');
  }
};
