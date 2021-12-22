import { Router } from 'express';
import NoteController from '../controllers/NoteController';
import TokenHelper from '../helpers/Token';
import imageUpload from '../helpers/tryUpload'

const noteRoute = Router();

noteRoute.post(
  '/create_note',
  TokenHelper.verifyToken,
  imageUpload,
  NoteController.createNote
);

noteRoute.get(
  '/get_notes/:menteeId',
  TokenHelper.verifyToken,
  NoteController.getNotes
);

export default noteRoute;
