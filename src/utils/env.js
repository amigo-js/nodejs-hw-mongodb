import dotenv from 'dotenv';

dotenv.config();

export function env(name, defaultValue) {
  const value = process.env[name];
  console.log(`ENV CHECK: ${name} = ${value}`); // Логируем переменные для отладки
  if (value) return value;
  if (defaultValue) return defaultValue;

  throw new Error(
    `Missing environment variable: ${name}. Ensure it exists in your .env file.`,
  );
}
