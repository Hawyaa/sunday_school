import { Router } from 'express';
import {
  submitContactMessage,
  getAdminContactMessages,
  toggleMessageReadStatus,
  deleteContactMessage,
} from './contact.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createContactMessageSchema } from './contact.schema';

export const publicContactRouter = Router();
export const adminContactRouter = Router();

// Public: send message from contact page
publicContactRouter.post(
  '/',
  validate({ body: createContactMessageSchema }),
  submitContactMessage
);

// Admin: view and manage messages
adminContactRouter.use(authenticate);
adminContactRouter.get('/', getAdminContactMessages);
adminContactRouter.patch('/:id/read', toggleMessageReadStatus);
adminContactRouter.delete('/:id', deleteContactMessage);
