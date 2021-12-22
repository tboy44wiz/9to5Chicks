import { Router } from 'express';
import Communities from '../controllers/Communities';
import {
  likeCommentSchema,
  deleteCommentSchema,
  postCommentSchema
} from '../validations/communitySchema';
import validator from '../middlewares/validator';
import TokenHelper from '../helpers/Token';
import imageUpload from '../helpers/singleUpload'

const communityRoute = Router();

communityRoute.get(
  '/get_connected_feeds',
  TokenHelper.verifyToken,
  Communities.getConnectedFeeds
);

communityRoute.post(
  '/like_or_unlike_post',
  TokenHelper.verifyToken,
  Communities.likeOrUnlikePost
);

communityRoute.post(
  '/send_user_post',
  TokenHelper.verifyToken,
  imageUpload,
  Communities.sendUserPost
);

communityRoute.post(
  '/delete_post',
  TokenHelper.verifyToken,
  Communities.deletePost
);

communityRoute.post(
  '/flag_post',
  TokenHelper.verifyToken,
  Communities.flagPost
);

communityRoute.post(
  '/send_comment',
  validator(postCommentSchema),
  TokenHelper.verifyToken,
  Communities.sendComment
);

communityRoute.post(
  '/like_user_comment',
  validator(likeCommentSchema),
  TokenHelper.verifyToken,
  Communities.likeUserComment
);

communityRoute.post(
  '/delete_comment',
  validator(deleteCommentSchema),
  TokenHelper.verifyToken,
  Communities.deleteComment
);

communityRoute.delete(
  '/delete_comment_reply',
  TokenHelper.verifyToken,
  Communities.deleteCommentReply
);

communityRoute.post(
  '/send_comment_reply',
  // validator(postCommentSchema),
  TokenHelper.verifyToken,
  Communities.sendCommentReply
);

communityRoute.post(
  '/like_user_comment_reply',
  // validator(likeCommentSchema),
  TokenHelper.verifyToken,
  Communities.likeUserCommentReply
);

export default communityRoute;
