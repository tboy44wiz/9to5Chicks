import { Router } from 'express';
import Admin from '../controllers/Admin';
import EventController from '../controllers/EventController';
import TokenHelper from '../helpers/Token';

const eventRoute = Router();

eventRoute.get(
  '/get_event/:id',
  TokenHelper.verifyToken,
  Admin.getAEvent
);

eventRoute.get(
  '/get_all_events',
  TokenHelper.verifyToken,
  Admin.getAllEvent
);

eventRoute.post(
  '/attend_event',
  TokenHelper.verifyToken,
  EventController.attendEvent
);

eventRoute.get(
  '/get_all_my_attendees',
  TokenHelper.verifyToken,
  EventController.getMyEvents
);

eventRoute.post(
  '/search_events',
  // TokenHelper.verifyToken,
  EventController.searchEvent
);

eventRoute.post(
  '/initiate/event_payment',
  TokenHelper.verifyToken,
  EventController.initiateEventPayment
);

eventRoute.post(
  '/verify_event_payment',
  TokenHelper.verifyToken,
  EventController.verifyAndUpdatePaymentHistory
);

export default eventRoute;
