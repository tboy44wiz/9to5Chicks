import { Router } from 'express';
import ResourcesController from '../controllers/ResourcesController';
import TokenHelper from '../helpers/Token';
import imageUploads from '../helpers/resourcesUpload'

const resourcesRoute = Router();

resourcesRoute.post(
  '/create_resources',
  TokenHelper.verifyToken,
  imageUploads,
  ResourcesController.create
);

resourcesRoute.get(
  '/get_resources/:id',
  TokenHelper.verifyToken,
  ResourcesController.get
);

resourcesRoute.get(
  '/get_resources_type',
  TokenHelper.verifyToken,
  ResourcesController.getAllByType
);

resourcesRoute.get(
  '/get_resources',
  TokenHelper.verifyToken,
  ResourcesController.getAll
);

resourcesRoute.post(
  '/update_resources/:id',
  TokenHelper.verifyToken,
  imageUploads,
  ResourcesController.update
);

resourcesRoute.delete(
  '/delete_resources/:id',
  TokenHelper.verifyToken,
  ResourcesController.delete
);



export default resourcesRoute;
