import Sequelize from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import db from '../database/models';
import Response from '../helpers/Response';

const { Op } = Sequelize;

const {
  User,
  Event,
  Attendee,
  PaymentHistory
} = db;


class EventController {
  static async getMyEvents(req, res) {
    try {
      const { payload } = req.payload;
      const { id: userId } = payload;

      const attendees = await Attendee.findAll({ where: { userId } });

      const allAttendees = attendees.map((data) => data.eventId);

      const myEvents = await Event.findAll({
        where: { id: allAttendees },
        include: [
          {
            model: Attendee,
            as: 'attendee',
            include: [
              { model: User, as: 'user' }
            ]
          }
        ]
      });

      if (!myEvents) {
        const response = new Response(
          false,
          400,
          'Error!, Event not found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved',
        { myEvents }
      );
      return res.status(response.code).json(response);
    } catch (error) {
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async searchEvent(req, res) {
    try {
      // const { payload } = req.payload;
      // const { id: userId } = payload;
      console.log(req.body);
      const { location, eventDate } = req.body;
      // let events
      // if(title && location === '' && eventDate === ''){
      //   events = await Event.findAll(
      //     {
      //       where: {
      //         // title,
      //         // location,
      //         // eventDate,
      //         title: {[Op.iLike]: '%' + title + '%'}
      //       }
      //     }
      //   );
      // }
      // if(title === '' && location && eventDate === ''){
      //   events = await Event.findAll(
      //     {
      //       where: {
      //         location: {[Op.iLike]: '%' + location + '%'}
      //       }
      //     }
      //   );
      // }
      // if(title === '' && location === '' && eventDate){
      //   const today = eventDate;
      //   const tomorrow = new Date(today);
      //   events = await Event.findAll(
      //     {
      //       where: {
      //         eventDate: tomorrow
      //       }
      //     }
      //   );
      // }
      // if(title && location && eventDate === ''){
      //   events = await Event.findAll(
      //     {
      //       where: {
      //         title: {[Op.iLike]: '%' + title + '%'},
      //         location: {[Op.iLike]: `%${location}%`}
      //       }
      //     }
      //   );
      // }
      // if(title && location === '' && eventDate){
      //   events = await Event.findAll(
      //     {
      //       where: {
      //         title: {[Op.iLike]: '%' + title + '%'},
      //         eventDate: {[Op.iLike]: `%${eventDate}%`}
      //       }
      //     }
      //   );
      // }
      // if(title && location && eventDate){
      //   events = await Event.findAll(
      //     {
      //       where: {
      //         title: {[Op.iLike]: '%' + title + '%'},
      //         location: {[Op.iLike]: `%${location}%`},
      //         eventDate: {[Op.iLike]: `%${eventDate}%`},
      //       }
      //     }
      //   );
      // }
      // if(title === '' && location && eventDate){
      //   events = await Event.findAll(
      //     {
      //       where: {
      //         location: {[Op.iLike]: `%${location}%`},
      //         eventDate: {[Op.iLike]: `%${eventDate}%`},
      //       }
      //     }
      //   );
      // }


      const events = await Event.findAll(
        {
          where: {
            // title,
            // location,
            // eventDate,
            [Op.or]: [{ title: { [Op.iLike]: `%${req.body.title}%` } }, { location: { [Op.iLike]: `%${location}%` } }, { eventDate: { [Op.eq]: eventDate } }]
            // [Op.or]: [ {title: {[Op.iLike]: '%' + req.body.title + '%'}}, {location: {[Op.iLike]: `%${location}%`}}, {eventDate: {[Op.like]: eventDate}}, {title, location}, {title, eventDate}, {location, eventDate} ]
          },
          include: [
            {
              model: Attendee,
              as: 'attendee',
              include: [
                { model: User, as: 'user' }
              ]
            }
          ]
        }
      );

      if (!events) {
        const response = new Response(
          false,
          404,
          'No event found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Search result successfuly',
        { events }
      );
      return res.status(response.code).json(response);
    } catch (error) {
      console.log(error);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async attendEvent(req, res) {
    try {
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { eventId, status } = req.body;
      // status - going, notGoing, interested
      const attendee = await Attendee.create({
        userId, eventId, status
      });

      if (!attendee) {
        const response = new Response(
          false,
          400,
          'Error! could not complete, Try again!',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully posted',
      );
      return res.status(response.code).json(response);
    } catch (error) {
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async initiateEventPayment(req, res) {
    try {
      const { payload } = req.payload;
      const { id: userId, email } = payload;
      const { amount, eventId } = req.body;

      const isAttended = await Attendee.findOne({ where: { userId, eventId, status: 'going' } });

      if (!isAttended) {
        await Attendee.create({
          userId, eventId, status: 'going'
        });
      }

      const isPaidBefore = await PaymentHistory.findOne({ where: { userId, eventId, status: 'successful' } });

      if (isPaidBefore) {
        const response = new Response(
          false,
          400,
          'Error! You have paid for this event',
        );
        return res.status(response.code).json(response);
      }

      const transactionId = uuidv4();
      const reference = uuidv4();
      const publicKey = `${process.env.PAYSTACK_PK}`;

      const paymentHistory = await PaymentHistory.create({
        userId,
        eventId,
        amount,
        status: 'pending',
        transactionId,
        reason: 'event',
        reference
      });

      if (!paymentHistory) {
        const response = new Response(
          false,
          400,
          'Error! creating payment history',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        false,
        201,
        'Payment history created successfully',
        {
          transactionId, publicKey, paymentHistory, email, reference
        }
      );
      return res.status(response.code).json(response);
    } catch (error) {
      console.log(error);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async verifyAndUpdatePaymentHistory(req, res) {
    try {
      const { payload } = req.payload;
      const { id: userId } = payload;
      const resp = req.body;

      const checkVerification = await axios
        .get(
          `https://api.paystack.co/transaction/verify/${resp.reference}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SK}`,
            },
          },
        );

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
            reason: 'event',
            transactionId: checkVerification.data.data.metadata.custom_fields[0].transaction_id,
            // reference: checkVerification.data.data.reference,
          },
          returning: true,
          plain: true
        }
      );

      if (!paymentHistory) {
        const response = new Response(
          false,
          400,
          'Error! Verifying and Completing Payment',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully paid for the event',
        { paymentHistory }
      );
      return res.status(response.code).json(response);
    } catch (error) {
      console.log(error);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }
}

export default EventController;
