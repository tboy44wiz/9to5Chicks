import { Router } from 'express';
import UsersController from '../controllers/UsersController';
import AuthMiddlewares from '../middlewares/AuthMiddlewares';
import TokenHelper from '../helpers/Token';
import imageUpload from '../helpers/singleUpload';

const userRoute = Router();

userRoute.get(
  '/get_onboarding_status',
  TokenHelper.verifyToken,
  UsersController.getOnBoadingStatus
);

userRoute.patch(
  '/onboarding_one',
  TokenHelper.verifyToken,
  UsersController.onBoardingOne
);

userRoute.patch(
  '/onboarding_two',
  TokenHelper.verifyToken,
  UsersController.onBoardingTwo
);

userRoute.patch(
  '/invite_friends',
  TokenHelper.verifyToken,
  UsersController.inviteFriends
);

userRoute.patch(
  '/onboarding_three',
  TokenHelper.verifyToken,
  UsersController.onBoardingThree
);

userRoute.post(
  '/add_work_history',
  TokenHelper.verifyToken,
  UsersController.createWorkHistory
);

userRoute.patch(
  '/update_work_history/:workId',
  TokenHelper.verifyToken,
  UsersController.editWorkHistory
);

userRoute.get(
  '/get_work_history/:workId',
  TokenHelper.verifyToken,
  UsersController.getWorkHistory
);

userRoute.post(
  '/delete_work_history',
  TokenHelper.verifyToken,
  UsersController.deleteWorkHistory
);

userRoute.patch(
  '/update_avatar',
  TokenHelper.verifyToken,
  imageUpload,
  UsersController.updateProfileAvatar
);

userRoute.patch(
  '/update_cover_image',
  TokenHelper.verifyToken,
  imageUpload,
  UsersController.updateCoverImage
);

userRoute.post(
  '/create_edu_history',
  TokenHelper.verifyToken,
  UsersController.createEduHistory
);

userRoute.patch(
  '/edit_edu_history/:eduId',
  TokenHelper.verifyToken,
  UsersController.updateEduHistory
);

userRoute.get(
  '/get_all_edu_history',
  TokenHelper.verifyToken,
  UsersController.getAllEduHistory
);

userRoute.get(
  '/get_edu_history/:eduId',
  TokenHelper.verifyToken,
  UsersController.getEduHistory
);

userRoute.delete(
  '/delete_edu_history/:eduId',
  TokenHelper.verifyToken,
  UsersController.deleteEduHistory
);

userRoute.get(
  '/get_profile/:id',
  UsersController.viewOtherProfile
);


export default userRoute;


