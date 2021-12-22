import { Router } from 'express';
import Request from '../controllers/Request';
import TokenHelper from '../helpers/Token';

const requestRoute = Router();

requestRoute.post(
  '/friend_request/:friendId',
  TokenHelper.verifyToken,
  Request.sendRequest
);

requestRoute.get(
  '/my_friends',
  TokenHelper.verifyToken,
  Request.getFriends
);

requestRoute.get(
  '/friend_requests',
  TokenHelper.verifyToken,
  Request.getFriendRequests
);

requestRoute.post(
  '/update_friend_requests',
  TokenHelper.verifyToken,
  Request.acceptFriendRequest
);

requestRoute.get(
  '/get_all_users',
  TokenHelper.verifyToken,
  Request.findAllUsers
);

requestRoute.get(
  '/similar_occupation',
  TokenHelper.verifyToken,
  Request.findUsersBasedOnOccupation
);

requestRoute.get(
  '/similar_groups',
  TokenHelper.verifyToken,
  Request.findUsersBasedOnGroup
);


requestRoute.get(
  '/similar_hobbies',
  TokenHelper.verifyToken,
  Request.findUserBasedOnHobbiesInterest
);

export default requestRoute;
