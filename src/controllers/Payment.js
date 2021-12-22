import db from '../database/models';
import Sequelize from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Response from '../helpers/Response';
import jwtHelper from '../helpers/Token';
import { subscriptionFromPaystack } from '../services/payments';
import EmailNotifications from '../helpers/EmailNotifications';

const { Plan, Subscription, PaymentHistory, User } = db;

// test secret- sk_test_eb4e06ae2004ccb2154391dd92857c645e2823b2
// test public- pk_test_ff3f6e9bda9488e1054ddc04a562eb0e83e3732c

class Payment {
  static async createPlan(req, res){
    try{
      const { name, interval, amount, description, planType } = req.body;
      const resp = await axios.post(
        'https://api.paystack.co/plan',
        { ...req.body },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SK}`,
          },
        },
      )

      if(!resp.data.status){
        const response = new Response(
          false,
          400,
          `${resp.data.message}`,
        );
        return res.status(response.code).json(response);
      }

      const { plan_code, currency } = resp.data.data;

      const plan = await Plan.create({
        name,
        description,
        amount: amount / 100, 
        interval, 
        planCode: plan_code, 
        currency,
        planType
      });

      if(!plan){
        const response = new Response(
          false,
          400,
          'Error!, Something went wrong',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        201,
        'Successfully created a plan',
        { plan }
      );
      return res.status(response.code).json(response);

    }catch(error){
      console.log(error)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async updatePlan(req, res){
    try{
      const { id } = req.params;
      const { name, interval, description, amount, planType } = req.body;
      const resp = await axios.put(
        `https://api.paystack.co/plan/${id}`,
        { ...req.body },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SK}`,
          },
        },
      )

      if(!resp.data.status){
        const response = new Response(
          false,
          400,
          `${resp.data.message}`,
        );
        return res.status(response.code).json(response);
      }

      let plan;
      if(amount){
        plan = await Plan.update(
          { 
            name,
            description,
            amount: amount / 100, 
            interval,
            planType
          },
          { where: { planCode: id } }
        );
      } else {
        plan = await Plan.update(
          { ...req.body },
          { where: { planCode: id } }
        );
      }
      

      if(!plan){
        const response = new Response(
          false,
          400,
          'Error!, Something went wrong',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully updated a plan',
        { plan }
      );
      return res.status(response.code).json(response);

    }catch(error){
      console.log(error)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getPlans(req, res){
    try{
      const { planType } = req.query;
      // const planType = 'Achiever Chick';
      const plans = await Plan.findAll({ where: { planType }, order: [['createdAt', 'asc']]  });
      if(!plans.length){
        const response = new Response(
          false,
          404,
          'No plan found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved',
        { plans }
      );
      return res.status(response.code).json(response);

    }catch(error){
      console.log(error)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getAllPlans(req, res){
    try{
      const plans = await Plan.findAll();
      if(!plans.length){
        const response = new Response(
          false,
          404,
          'No plan found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved',
        { plans }
      );
      return res.status(response.code).json(response);

    }catch(error){
      console.log(error)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async initiatePayment(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId, email } = payload;
      const { amount, planCode, planId } = req.body;

      const checkPlanExists = await Plan.findOne({ where: { planCode } });
      if(!checkPlanExists){
        const response = new Response(
          false,
          400,
          'Error! Plan does not exists',
        );
        return res.status(response.code).json(response);
      }

      const isPaidBefore = await PaymentHistory.findOne({ where: { userId, reason: 'registration', status: 'successful' } });

      if(isPaidBefore){
        const response = new Response(
          false,
          400,
          'Error! You already have an existing subscription',
        );
        return res.status(response.code).json(response);
      }

      const transactionId = uuidv4();
      const reference = uuidv4();
      const publicKey = `${process.env.PAYSTACK_PK}`;

      const paymentHistory = await PaymentHistory.create({
        userId,
        amount,
        status: 'pending',
        transactionId,
        reason: 'registration',
        reference
      })

      if(!paymentHistory){
        const response = new Response(
          false,
          400,
          'Error! creating payment history',
        );
        return res.status(response.code).json(response);
      }

      await Subscription.create({
        planCode, planId, amount, userId, status: 'pending'
      });

      const response = new Response(
        false,
        201,
        'Payment history created successfully',
        { transactionId, publicKey, paymentHistory, email, reference, planCode, planType: checkPlanExists.planType }
      );
      return res.status(response.code).json(response);

    }catch(error){
      console.log(error)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  // static async verifyAndUpdatePaymentHistory(req, res){
  //   try{
  //     const { payload } = req.payload;
  //     const { id: userId, email } = payload;

  //     const {
  //       reference,
  //       status,
  //       trans,
  //       transaction,
  //       trxref,
  //     } = req.body;

  //     const paymentHistory = await PaymentHistory.update(
  //       {
  //         customerEmail: email,
  //         status: 'successful',
  //       },
  //       { 
  //         where: { 
  //           userId, 
  //           reason: 'registration',
  //           status: 'successful',
  //           transactionId: checkVerification.data.data.metadata.custom_fields[0].transaction_id,
  //           // reference: checkVerification.data.data.reference,
  //         },
  //         returning: true,
  //         plain: true
  //       }
  //     )

  //           await User.update(
  //       { hasSubscribed: true, chickType: checkVerification.data.data.metadata.custom_fields[0].planType },
  //       { where: { id: userId } }
  //     );

  //     const findUser = await User.findOne({ where: { id: userId }, attributes: ['firstName'] });

  //     const verificationToken = jwtHelper.generateToken({ email: checkVerification.data.data.customer.email });
  //     const verificationLink = `https://app.9to5chick.com/auth/verify?token=${verificationToken}`;
  //     EmailNotifications.signupEmail(checkVerification.data.data.customer.email, verificationLink, findUser.firstName);


  //   }catch(error){
  //     console.log(error)
  //     const response = new Response(
  //       false,
  //       500,
  //       'Server error, Please try again later',
  //     );
  //     return res.status(response.code).json(response);
  //   } 
  //   }
  // }

  static async verifyAndUpdatePaymentHistory(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const resp   = req.body;

      const checkVerification = await axios
      .get(
        `https://api.paystack.co/transaction/verify/${resp.reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SK}`,
          },
        },
      );

      if(checkVerification.data.data.status !== 'success'){
        const response = new Response(
          false,
          400,
          'Error! Payment was not successful',
        );
        return res.status(response.code).json(response);
      }

      const paymentHistory = await PaymentHistory.update(
        {
          customerId: checkVerification.data.data.customer.id,
          customerEmail: checkVerification.data.data.customer.email,
          bank: checkVerification.data.data.authorization.bank,
          status: 'successful',
        },
        { 
          where: { 
            userId, 
            // reason: 'registration', 
            transactionId: checkVerification.data.data.metadata.custom_fields[0].transaction_id,
            // reference: checkVerification.data.data.reference,
          },
          returning: true,
          plain: true
        }
      )

      if(!paymentHistory){
        const response = new Response(
          false,
          400,
          'Error! Verifying and Completing Payment',
        );
        return res.status(response.code).json(response);
      }

      const checkPlan = await axios
      .get(
        `https://api.paystack.co/plan/${checkVerification.data.data.plan}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SK}`,
          },
        },
      );

      await User.update(
        { hasSubscribed: true, chickType: checkVerification.data.data.metadata.custom_fields[0].planType },
        { where: { id: userId } }
      );

      const findUser = await User.findOne({ where: { id: userId }, attributes: ['firstName'] });

      const verificationToken = jwtHelper.generateToken({ email: checkVerification.data.data.customer.email });
      const verificationLink = `https://app.9to5chick.com/auth/verify?token=${verificationToken}`;
      EmailNotifications.signupEmail(checkVerification.data.data.customer.email, verificationLink, findUser.firstName);

      if(checkPlan.status === 200){
        const subscriptionLists = checkPlan.data.data.subscriptions;
        const userSubscription = [...subscriptionLists].filter(item => item.customer === checkVerification.data.data.customer.id);

        if(userSubscription.length){
          await Subscription.update(
            {
              customerId: checkVerification.data.data.customer.id,
              customerCode: checkVerification.data.data.customer.customer_code,
              subscriptionCode: userSubscription[0].subscription_code,
              status: userSubscription[0].status,
            },
            { 
              where: { 
                userId,
              },
              returning: true,
              plain: true
            }
          );
        } else {
          const sendData = {
            customer: checkVerification.data.data.customer.customer_code,
            plan: checkVerification.data.data.plan,
            authorization: checkVerification.data.data.authorization.authorization_code
          }
          const subscribeUser = await axios.post('https://api.paystack.co/subscription', sendData,
            { 
              headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SK}`,
              },
            }
          )

          if(subscribeUser.data.status){
            await Subscription.update(
              {
                customerId: checkVerification.data.data.customer.id,
                customerCode: checkVerification.data.data.customer.customer_code,
                subscriptionCode: subscribeUser.data.data.subscription_code,
                status: 'active',
              },
              { 
                where: { 
                  userId,
                },
                returning: true,
                plain: true
              }
            );
          }
        }

      } else {
        await Subscription.update(
          {
            customerId: checkVerification.data.data.customer.id,
            customerCode: checkVerification.data.data.customer.code,
          },
          { 
            where: { 
              userId,
            },
            returning: true,
            plain: true
          }
        );
      }

      const response = new Response(
        true,
        200,
        'Successfully paid',
        { paymentHistory }
      );
      return res.status(response.code).json(response);

    }catch(error){
      console.log(error)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getUserCurrentSubscription(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;

      const getSubCode = await Subscription.findOne({
        where: { userId },
        include: [{ model: Plan, as: 'plan' }] 
      });
      const { subscriptionCode } = getSubCode;

      const confirmSub = await subscriptionFromPaystack(subscriptionCode);
      if(!confirmSub.status){
        const response = new Response(
          false,
          400,
          'Error! Subscription not found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Subscription successfully retrieved',
        { subscription:  confirmSub.subscription, subscriptionDetails: getSubCode }
      );
      return res.status(response.code).json(response);

    }catch(error){
      console.log(error)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getUserSubscription(req, res){
    try{
      const { id } = req.params;
      const subscription = await axios
      .get(
        `https://api.paystack.co/subscription/${id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SK}`,
          },
        },
      );

      if(!subscription.data.status){
        const response = new Response(
          false,
          400,
          'Error! Subscription not found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Subscription successfully retrieved',
        { subscription:  subscription.data.data }
      );
      return res.status(response.code).json(response);

    }catch(error){
      console.log(error)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async disableSubsription(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;

      const { code, token } = req.body;
      const subscription = await axios
      .post(
        `https://api.paystack.co/subscription/disable`,
        { code, token },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SK}`,
          },
        },
      );

      if(!subscription.data.status){
        const response = new Response(
          false,
          400,
          'Error! disabling subscription',
        );
        return res.status(response.code).json(response);
      }

      await Subscription.update(
        { status: 'disabled' },
        { where: { id: userId } }
      );

      const response = new Response(
        true,
        200,
        'Subscription disabled successfully',
      );
      return res.status(response.code).json(response);

    }catch(error){
      console.log(error)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async initiateUpgradePayment(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId, email } = payload;
      const { amount, planCode, planId } = req.body;

      const checkPlanExists = await Plan.findOne({ where: { planCode } });
      if(!checkPlanExists){
        const response = new Response(
          false,
          400,
          'Error! Plan does not exists',
        );
        return res.status(response.code).json(response);
      }

      const isPaidBefore = await PaymentHistory.findOne({ where: { userId, reason: 'registration', status: 'successful' } });

      if(!isPaidBefore){
        const response = new Response(
          false,
          400,
          'Error! You do not have an existing subscription',
        );
        return res.status(response.code).json(response);
      }

      const transactionId = uuidv4();
      const reference = uuidv4();
      const publicKey = `${process.env.PAYSTACK_PK}`;

      const paymentHistory = await PaymentHistory.create({
        userId,
        amount,
        status: 'pending',
        transactionId,
        reason: 'registration',
        reference
      })

      if(!paymentHistory){
        const response = new Response(
          false,
          400,
          'Error! creating payment history',
        );
        return res.status(response.code).json(response);
      }

      await Subscription.update(
        { planCode, planId, amount, status: 'pending' },
        { where: { id: userId } }
      );

      const response = new Response(
        false,
        201,
        'Payment history created successfully',
        { transactionId, publicKey, paymentHistory, email, reference, planCode, planType: checkPlanExists.planType }
      );
      return res.status(response.code).json(response);

    }catch(error){
      console.log(error)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

}

export default Payment;
