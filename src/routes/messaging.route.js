import { Router } from 'express';
import Messaging from '../controllers/Messaging';
import TokenHelper from '../helpers/Token';
import imageUpload from '../helpers/singleUpload'

const messagingRoute = Router();

messagingRoute.post(
  '/send_message',
  TokenHelper.verifyToken,
  imageUpload,
  Messaging.sendMessage
);

messagingRoute.get(
  '/messages/:recipentId',
  TokenHelper.verifyToken,
  Messaging.getMessages
);

messagingRoute.get(
  '/unread_messages',
  TokenHelper.verifyToken,
  Messaging.getUnreadMessage
);

messagingRoute.get(
  '/friends_with_mssg',
  TokenHelper.verifyToken,
  Messaging.getFriendsWithMssgHistory
);

messagingRoute.get(
  '/friends_without_mssg',
  TokenHelper.verifyToken,
  Messaging.getFriendsWithoutHistory
);

export default messagingRoute;


