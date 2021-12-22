import { Router } from 'express';
import OneSignalController from '../controllers/OneSignalController';


//  Set Up Express Router
const signalRouter = Router();

// Create a Client
//signalRouter.get("/create_client", OneSignalController.createClient);     // Good

// Create Notification
signalRouter.post("/create_notification", OneSignalController.createNotification);    // Good

// Cancel Notification
signalRouter.post("/cancel_notification", OneSignalController.cancelNotification);   // Good

// View Notifications
signalRouter.get("/view_notifications", OneSignalController.viewNotifications);   // Good

// View Notification
signalRouter.get("/view_notification", OneSignalController.viewNotification);     // Good

// View Notification
signalRouter.post("/create_segment", OneSignalController.createSegment);     // Good

// View Notification
signalRouter.delete("/delete_segment", OneSignalController.deleteSegment);     // Good

export default signalRouter;
