import { Contact } from "../models/contact.js";

export const getAllContactsService = async () => {
  return await Contact.find();
};

export const getContactByIdService = async (id) => {
  return await Contact.findById(id);
};

export const createContactService = async (data) => {
  return await Contact.create(data);
};

export const updateContactService = async (id, data) => {
  return await Contact.findByIdAndUpdate(id, data, { new: true });
};

export const deleteContactService = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
