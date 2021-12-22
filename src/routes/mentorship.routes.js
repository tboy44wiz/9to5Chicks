import { Router } from 'express';
import Admin from '../controllers/Admin';
import MentorshipController from '../controllers/MentorshipController'
import TokenHelper from '../helpers/Token';

const mentorshipRoute = Router();

mentorshipRoute.post(
  '/assign_mentor',
  TokenHelper.verifyAdminToken('admin'),
  MentorshipController.assignMentor
);

mentorshipRoute.post(
  '/apply_mentorship',
  TokenHelper.verifyToken,
  MentorshipController.createMentee
);

mentorshipRoute.post(
  '/send_invite_mentee',
  TokenHelper.verifyToken,
  MentorshipController.sendMentorshipInvite
)

mentorshipRoute.post(
  '/accept_mentor',
  TokenHelper.verifyToken,
  MentorshipController.acceptMentor
);

mentorshipRoute.get(
  '/mentorship_applications',
  TokenHelper.verifyAdminToken('admin'),
  MentorshipController.getMentorshipApplication
);

mentorshipRoute.get(
  '/mentorship_suggestions/:id',
  TokenHelper.verifyAdminToken('admin'),
  MentorshipController.getMentorshipSuggestion
);



export default mentorshipRoute;