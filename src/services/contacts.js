import { Contact } from '../models/contact.js';

export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error.message);
    throw new Error('Could not fetch contacts');
  }
};

export const getContactById = async (contactID) => {
  try {
    const contact = await Contact.findById(contactID);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  } catch (error) {
    console.error('Error fetching contact by ID:', error.message);
    throw new Error('Could not fetch contact');
  }
};
