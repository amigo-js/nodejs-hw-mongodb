import nodemailer from 'nodemailer';
import { env } from '../utils/env.js';


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
