import { Router } from 'express';
import AuthMiddlewares from '../middlewares/AuthMiddlewares';
import Admin from '../controllers/Admin';
import TokenHelper from '../helpers/Token';
import imageUploads from '../helpers/Uploads';
import imageUpload from '../helpers/singleUpload'

const adminRoute = Router();

adminRoute.post(
  '/ck_image_upload',
  TokenHelper.verifyAdminToken('admin'),
  imageUpload,
  Admin.ckImageUpload
);

adminRoute.get(
  '/stats',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getStatistics
);

adminRoute.post(
  '/create_event',
  TokenHelper.verifyAdminToken('admin'),
  imageUpload,
  Admin.createEvent
);

adminRoute.post(
  '/create_group',
  TokenHelper.verifyAdminToken('admin'),
  imageUploads,
  Admin.createGroup
);

adminRoute.delete(
  '/delete_group/:id',
  TokenHelper.verifyAdminToken('admin'),
  Admin.deleteGroup
);

adminRoute.post(
  '/admin_edit_group/:id',
  TokenHelper.verifyAdminToken('admin'),
  imageUploads,
  Admin.editGroup
);

adminRoute.get(
  '/post_details',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getPostDetails
)

adminRoute.get(
  '/get_events_infos',
  // TokenHelper.verifyAdminToken('admin'),
  TokenHelper.verifyToken,
  Admin.getEventInfos
);

adminRoute.get(
  '/specific_event/:id',
  TokenHelper.verifyToken,
  Admin.getSpecificEventInfos
);

adminRoute.get(
  '/get_a_event/:id',
  TokenHelper.verifyToken,
  Admin.getAEvent
);

adminRoute.get(
  '/get_all_event',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getAllEvent
);

adminRoute.post(
  '/update_event/:id',
  TokenHelper.verifyAdminToken('admin'),
  imageUpload,
  Admin.editEvent
);

adminRoute.delete(
  '/delete_event',
  TokenHelper.verifyAdminToken('admin'),
  Admin.deleteEvent
);

adminRoute.get(
  '/all_users',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getAllUsers
);

adminRoute.get(
  '/get_all_networks',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getUsers
);

adminRoute.get(
  '/get_all_mentors',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getMentors
);

adminRoute.get(
  '/all_user_details/:id',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getUser
);

adminRoute.get(
  '/all_invites',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getAllInvites
);

adminRoute.post(
  '/update_user_status/:id',
  TokenHelper.verifyAdminToken('admin'),
  Admin.updateUserStatus
);

adminRoute.delete(
  '/delete_user_account/:id',
  TokenHelper.verifyAdminToken('admin'),
  Admin.deleteUserAccount
);

adminRoute.delete(
  '/admin_delete_post/:postId',
  TokenHelper.verifyAdminToken('admin'),
  Admin.deletePost
);

adminRoute.post(
  '/create_ice_breaker',
  TokenHelper.verifyAdminToken('admin'),
  Admin.createIceBreaker
);

adminRoute.get(
  '/ice_breaker',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getIceBreakers
);

adminRoute.post(
  '/create_post_question',
  TokenHelper.verifyAdminToken('admin'),
  Admin.createPostQuestion
);

adminRoute.post(
  '/create_user',
  TokenHelper.verifyAdminToken('admin'),
  AuthMiddlewares.checkExistingUser,
  Admin.createUser
);

adminRoute.post(
  '/resend_signup_notification',
  TokenHelper.verifyAdminToken('admin'),
  Admin.resendSignUpMail
);





adminRoute.post(
  '/send_mail_notifications',
  TokenHelper.verifyAdminToken('admin'),
  Admin.sendBroadcastMail
);

adminRoute.post(
  '/send_engagement_mail',
  TokenHelper.verifyAdminToken('admin'),
  Admin.sendEngagementMail
);

adminRoute.get(
  '/get_all_broadcast_mails',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getAllBroadcastMails
);
adminRoute.get(
  '/get_single_broadcast_mail/:id',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getSingleBroadcastMail
);

adminRoute.get(
  '/get_all_engagement_mails',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getAllEngagementMails
);
adminRoute.get(
  '/get_single_engagement_mail/:id',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getSingleEngagementMail
);

adminRoute.get(
  '/get_all_days_of_the_week_posts',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getAllDaysOfTheWeekPosts
);
adminRoute.get(
  '/get_admin_posts',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getAdminPosts
);
adminRoute.get(
  '/get_users_posts',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getUsersPost
);
adminRoute.get(
  '/get_announcement',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getAnnouncement
);
adminRoute.get(
  '/get_events',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getEvents
);



adminRoute.get(
  '/get_daily_posts',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getDailyPost
);

adminRoute.get(
  '/get_monthly_posts',
  TokenHelper.verifyAdminToken('admin'),
  Admin.getMonthlyPost
);



export default adminRoute;
