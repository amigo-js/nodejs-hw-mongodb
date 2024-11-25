import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';
import mongoose from 'mongoose';

const PORT = Number(env('PORT', '3000'));

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    })
  );

  app.get('/', (req, res) => {
    res.json({ message: 'Hello world!' });
  });

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.json({
        status: 200,
        message: 'Successfully fetched contacts!',
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Failed to fetch contacts',
        error: error.message,
      });
    }
  });

  app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    try {
      const contact = await getContactById(id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      res.json({
        status: 200,
        message: `Successfully found contact with id ${id}!`,
        data: contact,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Failed to fetch contact',
        error: error.message,
      });
    }
  });

  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
