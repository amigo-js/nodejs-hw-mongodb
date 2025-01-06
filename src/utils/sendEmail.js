import nodemailer from 'nodemailer';
import { env } from '../utils/env.js';

console.log('SMTP_HOST:', env('SMTP_HOST'));
console.log('SMTP_PORT:', env('SMTP_PORT'));
console.log('SMTP_USER:', env('SMTP_USER'));
console.log('SMTP_PASSWORD:', env('SMTP_PASSWORD'));

const transporter = nodemailer.createTransport({
  host: env('SMTP_HOST'),
  port: Number(env('SMTP_PORT')),
  auth: {
    user: env('SMTP_USER'),
    pass: env('SMTP_PASSWORD'),
  },
});

export const sendEmail = async (options) => {
  try {
    const info = await transporter.sendMail(options);
    console.log('Email sent successfully:', info);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};
