import { Router } from 'express';
import Payment from '../controllers/Payment';
import TokenHelper from '../helpers/Token';

const paymentRoute = Router();

paymentRoute.post(
  '/create_plan',
  TokenHelper.verifyToken,
  Payment.createPlan
);

paymentRoute.put(
  '/update_plan/:id',
  TokenHelper.verifyToken,
  Payment.updatePlan
);

paymentRoute.get(
  '/plans',
  // TokenHelper.verifyToken,
  Payment.getPlans
);

paymentRoute.get(
  '/all_plans',
  TokenHelper.verifyToken,
  Payment.getAllPlans
);

paymentRoute.post(
  '/initiate/plan_subscription',
  TokenHelper.verifyToken,
  Payment.initiatePayment
);

paymentRoute.post(
  '/verify_payment',
  TokenHelper.verifyToken,
  Payment.verifyAndUpdatePaymentHistory
);

paymentRoute.get(
  '/get_subscription/:id',
  TokenHelper.verifyToken,
  Payment.getUserSubscription
);

paymentRoute.get(
  '/current_subscription',
  TokenHelper.verifyToken,
  Payment.getUserCurrentSubscription
);

paymentRoute.post(
  '/disable_subscription',
  TokenHelper.verifyToken,
  Payment.disableSubsription
);

paymentRoute.post(
  '/initiate/plan_subscription_upgrade',
  TokenHelper.verifyToken,
  Payment.initiateUpgradePayment
)

export default paymentRoute;
