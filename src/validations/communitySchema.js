import { check } from 'express-validator';

const likeCommentSchema = [
  check('commentId')
    .exists()
    .withMessage('CommentId is required')
];

const deleteCommentSchema = [
  check('commentId')
    .exists()
    .withMessage('CommentId is required')
];

const postCommentSchema = [
  check('postId')
    .exists()
    .withMessage('PostId is required'),
  check('comment')
    .exists()
    .withMessage('Comment is required')
];


export {
  likeCommentSchema,
  deleteCommentSchema,
  postCommentSchema
};
