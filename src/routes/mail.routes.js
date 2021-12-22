import { Router } from 'express';
import schedule from "node-schedule";
import MailNotification from '../controllers/MailNotification';
import TokenHelper from '../helpers/Token';
import imageUpload from '../helpers/mailUpload'

const mailRoute = Router();

mailRoute.post(
  '/create_mail_template',
  TokenHelper.verifyAdminToken('admin'),
  imageUpload,
  MailNotification.create
);

mailRoute.get(
  '/mail_templates',
  // TokenHelper.verifyAdminToken('admin'),
  MailNotification.getAll
);

mailRoute.patch(
  '/update_mail_template/:id',
  TokenHelper.verifyAdminToken('admin'),
  imageUpload,
  MailNotification.update
);

export default mailRoute;
