import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';

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
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
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
    try {
      const contactID = req.params.id;
      const contact = await getContactById(contactID);

      res.json({
        status: 200,
        message: `Successfully found contact with id ${contactID}!`,
        data: contact,
      });
    } catch (error) {
      if (error.message === 'Contact not found') {
        return res.status(404).json({
          message: 'Contact not found',
        });
      }
      res.status(500).json({
        status: 500,
        message: 'Failed to fetch contact',
        error: error.message,
      });
    }
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
