import { Router } from 'express';
import AnnouncementController from '../controllers/AnnouncementController';
import TokenHelper from '../helpers/Token';
import imageUpload from '../helpers/tryUpload'

const announcementRoute = Router();

announcementRoute.post(
  '/announcement/create',
  TokenHelper.verifyToken,
  AnnouncementController.create
);

announcementRoute.get(
  '/announcement/:id',
  TokenHelper.verifyToken,
  AnnouncementController.getOne
);

announcementRoute.get(
  '/announcements/all',
  TokenHelper.verifyToken,
  AnnouncementController.getAll
);

announcementRoute.post(
  '/update_announcement/:id',
  TokenHelper.verifyToken,
  AnnouncementController.edit
);

announcementRoute.post(
  '/delete_announcement/:id',
  TokenHelper.verifyToken,
  AnnouncementController.delete
);

export default announcementRoute;
