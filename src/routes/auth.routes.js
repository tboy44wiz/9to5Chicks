import { Router } from 'express';
import Auth from '../controllers/Auth';
import AuthMiddlewares from '../middlewares/AuthMiddlewares';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validations/authSchema';
import validator from '../middlewares/validator';
import TokenHelper from '../helpers/Token';

const authRoute = Router();

authRoute.post(
  '/users',
  Auth.getUser
);

authRoute.post(
  '/register',
  // validator(signupSchema),
  AuthMiddlewares.checkExistingUser,
  Auth.signup
);

authRoute.get(
  '/verify/:token',
  // TokenHelper.verifyToken,
  Auth.verifyEmail
);

authRoute.post(
  '/login',
  validator(loginSchema),
  Auth.login,
);

authRoute.post(
  '/sign_out',
  TokenHelper.verifyToken,
  Auth.signOut,
);

authRoute.post(
  '/user/forgot_password',
  Auth.forgotPassword
);

authRoute.post(
  '/user/reset_password/:resetToken',
  Auth.resetPassword
);


authRoute.get(
  '/user/details',
  TokenHelper.verifyToken,
  Auth.getUserDetails
);

authRoute.get(
  '/get_authenticated_user',
  TokenHelper.verifyToken,
  Auth.getUserDetails
);

authRoute.patch(
  '/update_profile',
  TokenHelper.verifyToken,
  Auth.updateProfileInfo
);

authRoute.patch(
  '/update_password',
  TokenHelper.verifyToken,
  Auth.updatePassword
);

// authRoute.post(
//   '/forgot_password',
//   validator(forgotPasswordSchema),
//   Auth.forgotPassword
// );

// authRoute.post(
//   '/reset_password/:resetToken',
//   validator(resetPasswordSchema),
//   Auth.resetPassword
// );

// authRoute.patch(
//   '/verify',
//   TokenHelper.verifyToken,
//   Auth.verifyEmail
// );

export default authRoute;
