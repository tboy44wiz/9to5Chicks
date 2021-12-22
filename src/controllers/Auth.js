import jwt from 'jsonwebtoken';
import mail from '@sendgrid/mail';
import mailer from '../config/Mailer';
import db from '../database/models';
import jwtHelper from '../helpers/Token';
import hashHelper from '../helpers/Hash';
import Response from '../helpers/Response';
import EmailNotifications from '../helpers/EmailNotifications';
import search from './Helper';
import template from '../helpers/emailTemplate';
import { subscriptionFromPaystack } from '../services/payments';

const { getUserDetails } = search;

const {
  // eslint-disable-next-line max-len
  User, Country, Friend, WorkHistory, EducationHistory, Goal, Mentorship, Subscription, PaymentHistory
} = db;
const { hashPassword } = hashHelper;
const { sendPasswordResetMail } = EmailNotifications;

/** authentication controller class */
class Auth {
  /**
   * @description - this method creates user
   *
   * @param {object} req - the request sent to the router
   * @param {object} res  - the request sent back from the controller
   * @returns {object} - object
   */
  static async signup(req, res) {
    try {
      const {
        firstName,
        lastName,
        password,
        // avatar
      } = req.body;
      const email = req.body.email.toLowerCase();
      const hashedPassword = hashPassword(password);
      const user = await User.create({
        // id: 23,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        onBoardingStep: 0,
        role: 'user',
        chickType: 'achiever'
        // avatar,
      });

      const { id, role, status } = user;
      const data = await getUserDetails(email);
      const { userDetails } = data;
      const token = jwtHelper.generateToken({
        id,
        email,
        role,
        status,
        userDetails
      });
      // const verificationToken = jwtHelper.generateToken({ email });
      // // const verificationLink = `http://${req.headers.host}/api/v1/auth/verify?token=${verificationToken}`;
      // const verificationLink = `https://app.9to5chick.com/auth/verify?token=${verificationToken}`;
      // EmailNotifications.signupEmail(email, verificationLink, firstName);

      const response = new Response(
        true,
        201,
        'User signup successfully',
        { userDetails, token }
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;
      // const decodedToken = authHelper.decode(token);
      // const { email } = decodedToken.userObj;

      const envSecret = process.env.TOKEN_SECRET;
      const payload = await jwt.verify(token, envSecret);
      // const { payload } = req.payload;
      const { email } = payload.payload;

      const user = await User.findOne({ where: { email } });
      if (user.status === 'active') {
        const response = new Response(
          false,
          403,
          'Your account has already been verified',
        );
        return res.status(response.code).json(response);
      }


      await User.update(
        { status: 'active' },
        {
          where: { email },
          returning: true,
          plain: true
        }
      );

      const response = new Response(
        true,
        200,
        'Account verification was successful',
      );
      return res.status(response.code).json(response);
      // return res.redirect(`https://app.9to5chick.com/auth/verify`);
    } catch (err) {
      console.log(err);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  /**
   * @description - this method login user
   *
   * @param {object} req - the request sent to the router
   * @param {object} res  - the request sent back from the controller
   * @returns {object} - object
   */
  static async login(req, res) {
    const email = req.body.email.toLowerCase();
    const { password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        const response = new Response(
          false,
          404,
          "Email doesn't exist. Please signup to join"
        );
        return res.status(response.code).json(response);
      }
      const hash = user.password;
      const result = hashHelper.comparePassword(hash, password);
      if (!result) {
        const response = new Response(
          false,
          401,
          'Incorrect password. Check password or click forgot password'
        );
        return res.status(response.code).json(response);
      }
      const {
        id, role, status, firstName, lastName, avatar, onBoardingStep, firstLogin, hasSubscribed
      } = user;

      if (status === 'inactive') {
        const response = new Response(
          false,
          401,
          'Account has been suspended, contact admin for re-activation'
        );
        return res.status(response.code).json(response);
      }

      const data = await getUserDetails(email);
      const { userDetails } = data;

      let url, confirmSub, currentPaymentStatus;

      if (role !== 'admin') {
        if (!hasSubscribed) {
          url = '/plan_page';
        } else if (parseInt(onBoardingStep) === 0) {
          url = '/onboarding_one';
          currentPaymentStatus = true;
        } else if (parseInt(onBoardingStep) === 1) {
          url = '/onboarding_two';
          currentPaymentStatus = true;
        } else {
          url = '/users/community';
          currentPaymentStatus = true;
        }
      } else {
        url = '/users/community';
        currentPaymentStatus = true;
      }

      // if(!hasSubscribed){
      //   url = '/plan_page'
      // }
      // } else {
      //   const getSubCode = await Subscription.findOne({ where: {userId: id} });
      //   const { subscriptionCode } = getSubCode;
      //   confirmSub = await subscriptionFromPaystack(subscriptionCode);

      //   if(confirmSub.status){
      //     const { next_payment_date, invoices, status } = confirmSub.subscription;
      //     if(new Date(next_payment_date).getFullYear() === new Date(Date.now()).getFullYear()){
      //       if((new Date(next_payment_date).getMonth() < new Date(Date.now()).getMonth())){
      //         // if(new Date(Date.now()).getDate() > new Date(next_payment_date).getDate()){
      //           if(status === 'active'){
      //             if(invoices[invoices.length - 1] !== 'success'){
      //               url = '/account/billing';
      //               currentPaymentStatus = false;
      //             }
      //           } else {
      //             url = '/account/billing';
      //             currentPaymentStatus = false;
      //           }
      //         // }
      //       }
      // } else if(parseInt(onBoardingStep) === 0){
      //   url = '/onboarding_one';
      //   currentPaymentStatus = true;
      // } else if(parseInt(onBoardingStep) === 1){
      //   url = '/onboarding_two';
      //   currentPaymentStatus = true;
      // } else{
      //   url = '/users/community';
      //   currentPaymentStatus = true;
      // }
      // } else {
      //   const response = new Response(
      //     false,
      //     400,
      //     'Confirm Internet connection'
      //   );
      //   return res.status(response.code).json(response);
      // }

      //   if(parseInt(onBoardingStep) === 0){
      //     url = '/onboarding_one';
      //     currentPaymentStatus = true;
      //   } else if(parseInt(onBoardingStep) === 1){
      //     url = '/onboarding_two';
      //     currentPaymentStatus = true;
      //   } else{
      //     url = '/users/community';
      //     currentPaymentStatus = true;
      //   }
      // }

      const token = jwtHelper.generateToken({
        id,
        email,
        role,
        status,
        userDetails,
        currentPaymentStatus
      });

      const response = new Response(
        true,
        200,
        'user logged in sucessfully',
        {
          userDetails,
          token,
          url,
          // subscription: confirmSub.subscription,
          currentPaymentStatus
        }
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async signOut(req, res) {
    try {
      const { payload } = req.payload;
      const { email } = payload;

      const user = await User.findOne({ where: { email } });

      if (!user.firstLogin) {
        await User.update(
          { firstLogin: true },
          {
            where: { email },
            returning: true,
            plain: true
          }
        );
      }

      const response = new Response(
        true,
        200,
        'Sign Out successfully',
      );
      return res.status(response.code).json(response);
    } catch (error) {
      console.log(error);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async forgotPassword(req, res) {
    try {
      // get the users email
      const email = req.body.email.toLowerCase();

      const user = await User.findOne({ where: { email } });


      if (!user) {
        const response = new Response(
          false,
          404,
          'Invalid Email',
        );
        return res.status(response.code).json(response);
      }

      const { password } = user;

      // generate a token and set a reset password date for the user
      // const pwdResetToken = await generateToken();
      const pwdResetToken = jwt.sign({ email, password }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

      // attach the token to the password reset link to be sent to the user
      const subject = 'Reset Password';
      const emailBody = `
      <h3>Hello ${user.firstName},</h3>
      <p>
      You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
      <br/>
      <p>Please click on the following link, or paste this into your browser to complete the process:<a class="btn" href="https://app.9to5chick.com/reset_password/${pwdResetToken}">Reset Password</a>
      <br/>
        If you did not request this, please ignore this email and your password will remain unchanged.`;
      const content = template(subject, emailBody);

      mailer.sendMail(email, subject, content);

      const response = new Response(
        true,
        200,
        `A response has been sent to ${email}`,
      );
      return res.status(response.code).json(response);
    } catch (error) {
      console.log(error);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async resetPassword(req, res) {
    try {
      // get the reset password token and new password
      const { password } = req.body;
      const { resetToken: token } = req.params;

      if (typeof password !== 'string' || password === '') {
        const response = new Response(
          false,
          400,
          'Password field is required'
        );
        return res.status(response.code).json(response);
      }

      if (password.length < 6) {
        const response = new Response(
          false,
          400,
          'Password field cannot be lesser than 6 characters'
        );
        return res.status(response.code).json(response);
      }

      // check if it is still valid
      const envSecret = process.env.TOKEN_SECRET;
      const payload = await jwt.verify(token, envSecret);

      const { email, password: passwordFromLink } = payload;

      const user = await User.findOne({ where: { email } });

      if (passwordFromLink !== user.password) {
        const response = new Response(
          false,
          403,
          'The Password reset token is invalid or has expired',
        );
        return res.status(response.code).json(response);
      }

      const hashedPassword = hashHelper.hashPassword(password);

      // else, update the password
      await User.update(
        {
          password: hashedPassword,
        },
        {
          where: { id: user.id },
          returning: true,
          plain: true
        },
      );

      const subject = 'Your password has been changed';
      const emailBody = `
      <h3>Hello ${user.firstName},</h3>
      <p>
      Hello, </p>
      <br/>
      <p>This is a confirmation that the password for your account ${user.email} has just been changed.
      <br/>
        If you did not request this, please ignore this email and your password will remain unchanged.`;
      const content = template(subject, emailBody);

      mailer.sendMail(user.email, subject, content);

      const response = new Response(
        true,
        200,
        'Success! Your password has been changed.',
      );
      return res.status(response.code).json(response);
    } catch (error) {
      // if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      //   return res.status(400).json('Expired reset link');
      // }
      // next(error);
      console.log(error);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getUser(req, res) {
    try {
      // const user = await User.findAll();
      await EmailNotifications.signupEmail('olutimedia@gmail.com', 'youtube.com', 'femi');

      return res.status(200).json({ message: 'dont know' });
    } catch (err) {
      console.log(err);
    }
  }

  static async getUserDetails(req, res) {
    try {
      const { payload } = req.payload;
      const {
        email, id, role, status
      } = payload;

      const data = await getUserDetails(email);
      const { userDetails } = data;

      const currentPaymentStatus = true;
      // if(role !== 'admin' && userDetails.chickType !== 'titan'){
      //   const getSubCode = await Subscription.findOne({ where: { userId: id } });
      //   const { subscriptionCode } = getSubCode;
      //   const confirmSub = await subscriptionFromPaystack(subscriptionCode);
      //   if(confirmSub.status){
      //     const { next_payment_date, invoices, status } = confirmSub.subscription;
      //       if(new Date(next_payment_date).getFullYear() === new Date(Date.now()).getFullYear()){
      //         if((new Date(next_payment_date).getMonth() < new Date(Date.now()).getMonth())){
      //           if(invoices[invoices.length - 1] !== 'success'){
      //             currentPaymentStatus = false;
      //           }
      //         }
      //       } else {
      //         currentPaymentStatus = true;
      //       }
      //     currentPaymentStatus = true;
      //   }
      // } else {
      //   currentPaymentStatus = true;
      // }


      const token = jwtHelper.generateToken({
        id,
        email,
        role,
        status,
        userDetails,
        currentPaymentStatus
      });

      if (!userDetails) {
        const response = new Response(
          false,
          404,
          'Not found'
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'User details succesfully retrieved',
        { userDetails, token, currentPaymentStatus }
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getAuthenticatedUser(req, res) {
    try {
      const { payload } = req.payload;
      const { email } = payload;
      const user = await User.scope('withoutPassword').findOne({ where: { email } });

      if (!user) {
        const response = new Response(
          false,
          404,
          'Not found'
        );
        return res.status(response.code).json(response);
      }

      const country = await Country.findAll();

      const response = new Response(
        true,
        200,
        'User details succesfully retrieved',
        { user, country }
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async updatePassword(req, res) {
    try {
      const { payload } = req.payload;
      const { email } = payload;

      const { currentPassword, newPassword } = req.body;

      if (newPassword.length < 6 || currentPassword.length < 6) {
        const response = new Response(
          false,
          400,
          'Password cannot be less than six characters'
        );
        return res.status(response.code).json(response);
      }

      const user = await User.findOne({ where: { email } });
      const hash = user.password;
      const result = hashHelper.comparePassword(hash, currentPassword);
      if (!result) {
        const response = new Response(
          false,
          400,
          'current password is incorrect! Please try again'
        );
        return res.status(response.code).json(response);
      }

      const passwordHash = hashPassword(newPassword);
      // update user's password
      await User.update({ password: passwordHash }, { where: { email } });

      const response = new Response(
        true,
        200,
        'Password updated successfully'
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async updateProfileInfo(req, res) {
    try {
      const { payload } = req.payload;
      const { email } = payload;
      const {
        firstName,
        lastName,
        country,
        jobSector,
        jobTitle,
        language,
        dob,
        city,
        avatar,
        hobbies,
        interests
      } = req.body;

      const user = await User.scope('withoutPassword').update(
        {
          firstName,
          lastName,
          country,
          jobSector,
          jobTitle,
          language,
          dob,
          city,
          avatar,
          hobbies,
          interests
        },
        { where: { email } }
      );

      if (!user) {
        const response = new Response(
          false,
          400,
          'Error, try again!'
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'User details successfully updated',
        user,
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }
}

export default Auth;
