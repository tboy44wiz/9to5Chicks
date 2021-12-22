import { check } from 'express-validator';
import capitalize from '../helpers/capitalize';

// const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

/* eslint-disable arrow-parens */
const signupSchema = [
  check('firstName')
    .trim()
    .exists().withMessage('First name is required')
    .isLength({ min: 2, max: 15 })
    .withMessage('First name should be between 2 to 15 characters')
    .isAlpha()
    .withMessage('First name should only contain alphabets')
    .customSanitizer(value => capitalize(value)),

  check('lastName')
    .trim()
    .exists().withMessage('Last name is required')
    .isLength({ min: 2, max: 15 })
    .withMessage('Last name should be between 2 to 15 characters')
    .isAlpha()
    .withMessage('Last name should only contain alphabets')
    .customSanitizer(value => capitalize(value)),

  check('email')
    .trim()
    .exists()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Email address is invalid'),

  check('password')
    .trim()
    .exists().withMessage('Password is required')
    .isLength({ min: 8, })
    .withMessage('Password must be alphanumeric and not be less than 8 characters')
    .isAlphanumeric()
    .withMessage('Password must be alphanumeric and not be less than 8 characters'),

  check('avatar')
    .optional()
];

const forgotPasswordSchema = [
  check('email')
    .not().isEmpty({ ignore_whitespace: true })
    .withMessage('Email is required')
    .trim()
    .isEmail()
    .withMessage('Invalid email format'),
];

const resetPasswordSchema = [
  check('password')
    .not().isEmpty({ ignore_whitespace: true })
    .withMessage('Password is required')
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage('Password should be between 8 to 32 characters'),
  check('confirmPassword')
    .custom((value, { req }) => {
      const { password } = req.body;
      if (value !== password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })];

const loginSchema = [
  check('email')
    .trim()
    .exists()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Email address is invalid'),
];

export {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};
