import { Contact } from '../models/contact.js';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (contactID) => {
  return await Contact.findById(contactID);
};
