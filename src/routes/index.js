import { Router } from 'express';
import authRoute from './auth.routes';
import communityRoute from './community.routes';
import userRoute from './user.routes';
import groupRoute from './group.routes';
import requestRoute from './request.routes';
import messagingRoute from './messaging.route';
import goalRoute from './goal.routes';
import adminRoute from './admin.routes';
import eventRoute from './event.routes';
import mentorshipRoute from './mentorship.routes';
import noteRoute from './note.routes';
import announcementRoute from './announcement.routes';
import paymentRoute from './payment.routes';
import resourcesRoute from './resources.routes';
import mailRoute from './mail.routes';
import oneSignalRoute from './OneSignalRoute';

const router = Router();

router.use('/auth', authRoute);
router.use('/communities', communityRoute);
router.use('/users', userRoute);
router.use('/', groupRoute);
router.use('/', requestRoute);
router.use('/', messagingRoute);
router.use('/', goalRoute);
router.use('/', adminRoute);
router.use('/', eventRoute);
router.use('/', mentorshipRoute);
router.use('/', noteRoute);
router.use('/', announcementRoute);
router.use('/', paymentRoute);
router.use('/', resourcesRoute);
router.use('/', mailRoute);
router.use('/', oneSignalRoute);

export default router;
