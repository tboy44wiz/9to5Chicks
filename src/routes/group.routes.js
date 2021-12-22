import { Router } from 'express';
import GroupController from '../controllers/GroupController';
import TokenHelper from '../helpers/Token';
import imageUpload from '../helpers/singleUpload'
import imageUploads from '../helpers/Uploads'

const groupRoute = Router();

groupRoute.get(
  '/groups',
  TokenHelper.verifyToken,
  GroupController.getAllGroup
);

groupRoute.get(
  '/filtered_groups',
  TokenHelper.verifyToken,
  GroupController.getPaginatedGroup
);

groupRoute.get(
  '/group/:id',
  TokenHelper.verifyToken,
  GroupController.getAGroup
);

groupRoute.patch(
  '/update_group_image',
  TokenHelper.verifyToken,
  imageUpload,
  GroupController.updateGroupImage
);

groupRoute.get(
  '/my_groups',
  TokenHelper.verifyToken,
  GroupController.getMyGroup
);

groupRoute.get(
  '/filtered/my_groups',
  TokenHelper.verifyToken,
  GroupController.getMyPaginatedGroup
);

groupRoute.get(
  '/mentee_groups/:id',
  TokenHelper.verifyToken,
  GroupController.getMenteeGroups
);

groupRoute.post(
  '/user_create_group',
  TokenHelper.verifyToken,
  imageUploads,
  GroupController.createGroup
);

groupRoute.post(
  '/edit_group/:id',
  TokenHelper.verifyToken,
  imageUploads,
  GroupController.editGroup
);

groupRoute.post(
  '/join_group/:groupId',
  TokenHelper.verifyToken,
  GroupController.joinGroup
);

groupRoute.post(
  '/create_group_post',
  TokenHelper.verifyToken,
  imageUpload,
  GroupController.createGroupPost
);

groupRoute.post(
  '/leave_group/:groupId',
  TokenHelper.verifyToken,
  GroupController.leaveGroup
)

groupRoute.post(
  '/create_group_comment',
  TokenHelper.verifyToken,
  GroupController.createGroupComment
);

groupRoute.post(
  '/create_group_comment_reply',
  TokenHelper.verifyToken,
  GroupController.sendGroupCommentReply
);

groupRoute.get(
  '/group_posts/:groupId',
  TokenHelper.verifyToken,
  GroupController.getGroupPost
);

groupRoute.get(
  '/all_group_posts',
  TokenHelper.verifyToken,
  GroupController.getAllGroupPost
);

groupRoute.post(
  '/toggle_group_post_like',
  TokenHelper.verifyToken,
  GroupController.togglePostLike
);

groupRoute.post(
  '/toggle_group_comment_like',
  TokenHelper.verifyToken,
  GroupController.toggleCommentLike
);


groupRoute.post(
  '/toggle_group_comment_reply_like',
  TokenHelper.verifyToken,
  GroupController.toggleCommentReplyLike
);

groupRoute.post(
  '/delete_group_post',
  TokenHelper.verifyToken,
  GroupController.deleteGroupPost
);

groupRoute.post(
  '/delete_group_comment_reply',
  TokenHelper.verifyToken,
  GroupController.deleteGroupCommentReply
);

groupRoute.post(
  '/delete_group_comment',
  TokenHelper.verifyToken,
  GroupController.deleteGroupComment
);

export default groupRoute;

