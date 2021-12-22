import Sequelize, { where } from 'sequelize';
import moment from 'moment';
import db from '../database/models';
import Response from '../helpers/Response';
import jwtHelper from '../helpers/Token';
import hashHelper from '../helpers/Hash';
import EmailNotifications from '../helpers/EmailNotifications';
import template from '../helpers/emailTemplate';
import mailer from '../config/Mailer';
import cron from 'node-cron';

const { hashPassword } = hashHelper;
const { Op } = Sequelize;

const {
  User,
  Country,
  Group,
  Announcement,
  Post,
  GroupPost,
  Comment,
  GroupComment,
  Event,
  Attendee,
  Friend,
  Like,
  GroupMember,
  PaymentHistory,
  WorkHistory,
  EducationHistory,
  Mentorship,
  CronTask,
  Subscription,
  EmailRoundUp,
} = db;


class Admin {
  static async getStatistics(req, res) {
    try {
      // total invites sent
      const totalSentInvites = await Friend.count({
        where: { invites: 'sent' }
      });

      // total users
      const totalUsers = await User.count({
        where: { role: 'user' }
      });

      // total active users
      const totalActiveUsers = await User.count({
        where: { status: 'active' }
      });

      // total accepted invites
      const totalAcceptedInvites = await Friend.count({
        where: { invites: 'accepted' }
      });

      // unsubscribed users

      // active events
      const totalActiveEvents = await Event.count({
        where: { eventDate: { [Op.gte]: moment() } }
      });

      // active groups
      // inactive users
      const totalInActiveUsers = await User.count({
        where: { status: 'inactive' }
      });

      // total post
      const totalPost = await Post.count();

      // total likes
      const totalLikes = await Post.count();

      // total comments
      const totalComments = await Post.count();

      // todays post
      const todayPosts = await Post.count({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn('DATE', Sequelize.col('created_at')),
              Sequelize.literal('CURRENT_DATE')
            )
          ]
        }
      });

      // todays likes
      const todayLikes = await Like.count({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn('DATE', Sequelize.col('created_at')),
              Sequelize.literal('CURRENT_DATE')
            )
          ]
        }
      });

      // todays comment
      const todayComments = await Comment.count({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn('DATE', Sequelize.col('created_at')),
              Sequelize.literal('CURRENT_DATE')
            )
          ]
        }
      });

      // todays invites
      const todayInvites = await Friend.count({
        where: {
          [Op.and]: [
            { invites: 'sent' },
            Sequelize.where(
              Sequelize.fn('DATE', Sequelize.col('created_at')),
              Sequelize.literal('CURRENT_DATE')
            )
          ]
        }
      });

      // todays accepted invites
      const todayAcceptedInvites = await Friend.count({
        where: {
          [Op.and]: [
            { invites: 'accepted' },
            Sequelize.where(
              Sequelize.fn('DATE', Sequelize.col('created_at')),
              Sequelize.literal('CURRENT_DATE')
            )
          ]
        }
      });

      // todays group likes
      // const todayComments = await Group.count({
      //   where: { createdAt: {[Op.eq]: moment()} }
      // });

      const response = new Response(
        true,
        200,
        'Successfully retrieved',
        {
          totalUsers,
          totalSentInvites,
          totalAcceptedInvites,
          totalActiveUsers,
          totalInActiveUsers,
          totalActiveEvents,
          totalPost,
          totalComments,
          totalLikes,
          todayPosts,
          todayLikes,
          todayComments,
          todayInvites,
          todayAcceptedInvites
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

  static async createEvent(req, res) {
    try {
      const { payload } = req.payload;
      const { id: userId } = payload;
      // const {
      //   title,
      //   description,
      //   location,
      //   eventDate,
      //   price,
      //   startTime,
      //   endTime,
      //   eventBanner } = req.body;

      const event = await Event.create({
        ...req.body,
        eventBanner: `http://${req.headers.host}/uploads/${req.file.filename}` || null,
        userId
      });

      if (!event) {
        const response = new Response(
          false,
          400,
          'Error!, creating event',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        201,
        'Successfully created event',
        { event }
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

  static async getAEvent(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findOne(
        {
          where: { id },
          include: [
            {
              model: Attendee,
              as: 'attendee',
              include: [
                { model: User, as: 'user' }
              ]
            }
          ]
        },
      );

      if (!event) {
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
        { event }
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

  static async getAllEvent(req, res) {
    try {
      const events = await Event.findAll({
        include: [
          {
            model: Attendee, as: 'attendee',
            include: [
              { model: User, as: 'user' }
            ]
          }
        ]
      });

      if (!events.length) {
        const response = new Response(
          false,
          400,
          'Error!, No Event Found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved',
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

  static async editEvent(req, res) {
    try {
      const { id } = req.params;
      const {
        title, description, location, eventDate, price
      } = req.body;

      let event;
      if (req.file) {
        event = await Event.update(
          { ...req.body, eventBanner: `http://${req.headers.host}/uploads/${req.file.filename}` },
          {
            where: { id },
            returning: true,
            plain: true
          }
        );
      } else {
        event = await Event.update(
          { ...req.body },
          {
            where: { id },
            returning: true,
            plain: true
          }
        );
      }

      if (!event) {
        const response = new Response(
          false,
          400,
          'Error!, updating event',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully updated',
        { event }
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

  static async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.destroy({ where: { id } });

      if (!event) {
        const response = new Response(
          false,
          400,
          'Error! deleting, Try Again!',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Deleted Successfully',
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

  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        include: [
          {
            model: Post,
            as: 'post',
            // include: [
            //   { model: User, as: 'user' }
            // ]
          }
        ]
      });

      if (!users.length) {
        const response = new Response(
          false,
          400,
          'Error!, No User Found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved',
        { users }
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

  static async getAllInvites(req, res) {
    try {
      const invites = await Friend.findAll();

      if (!invites.length) {
        const response = new Response(
          false,
          400,
          'Error!, No Invite Found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved',
        { invites }
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

  static async getEventInfos(req, res) {
    try {
      const pastEventLength = await Event.count(
        {
          where: {
            eventDate: { [Op.lt]: moment() }
          }
        }
      );

      const activeEventLength = await Event.count(
        {
          where: {
            eventDate: { [Op.gte]: moment() }
          }
        }
      );

      const totalGoing = await Attendee.count(
        {
          where: { status: 'going' }
        }
      );

      const totalInterested = await Attendee.count(
        {
          where: { status: 'interested' }
        }
      );

      const response = new Response(
        true,
        200,
        'Successfully retrieved',
        {
          pastEventLength, activeEventLength, totalGoing, totalInterested
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

  static async getSpecificEventInfos(req, res) {
    try {
      const { id } = req.params;

      const event = await Event.findOne({ where: { id } });

      if (!event) {
        const response = new Response(
          false,
          400,
          'Error! not found',
        );
        return res.status(response.code).json(response);
      }

      const allAttendees = await Attendee.findAll({
        where: { eventId: id },
        include: [{ model: User, as: 'user' }]
      });

      const totalGoing = await Attendee.count(
        {
          where: { status: 'going', eventId: id }
        }
      );

      const totalInterested = await Attendee.count(
        {
          where: { status: 'interested', eventId: id }
        }
      );

      const totalNotGoing = await Attendee.count(
        {
          where: { status: 'notGoing', eventId: id }
        }
      );

      const response = new Response(
        true,
        200,
        'Successfully retrieved',
        {
          event, allAttendees, totalGoing, totalInterested, totalNotGoing
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

  static async getUsers(req, res) {
    try {
      const users = await User.findAll();
      /*{
        include: [
          { model: Subscription, as: 'subscription' }
        ]
      }*/

      if (!users.length) {
        const response = new Response(
          false,
          400,
          'No user found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Succefully retrieved users',
        { users }
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

  static async getMentors(req, res) {
    try {
      const users = await User.findAll({ where: { chickType: 'titan' } });

      if (!users.length) {
        const response = new Response(
          false,
          400,
          'No user found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Succefully retrieved users',
        { users }
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

  static async getPostDetails(req, res) {
    try {
      const posts = await Post.findAll({
        include: [
          { model: Comment, as: 'comment' },
          { model: Like, as: 'like' }
        ]
      });

      if (!posts.length) {
        const response = new Response(
          false,
          400,
          'No post found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Succefully retrieved posts',
        { posts }
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

  static async createGroup(req, res) {
    try {
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { name, description, isOpen } = req.body;

      // console.log(req.files);

      const group = await Group.create({
        userId,
        name,
        avatar: req.files.avatar ? `http://${req.headers.host}/uploads/${req.files.avatar[0].filename}` : null,
        description,
        groupBanner: req.files.groupBanner ? `http://${req.headers.host}/uploads/${req.files.groupBanner[0].filename}` : null,
        isOpen
      });

      if (!group) {
        const response = new Response(
          false,
          400,
          'Group unsuccessfully created',
        );
        return res.status(response.code).json(response);
      }

      await GroupMember.create({
        userId, groupId: group.id
      });

      const response = new Response(
        true,
        201,
        'Group created successfully',
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async editGroup(req, res) {
    try {
      const { payload } = req.payload;
      const { id: userId } = payload;
      // const { name, description, isOpen } = req.body;

      const { id } = req.params;

      if (req.files.avatar) {
        await Group.update(
          {
            avatar: `http://${req.headers.host}/uploads/${req.files.avatar[0].filename}`,
          },
          { where: { id } }
        );
      }

      if (req.files.groupBanner) {
        await Group.update(
          {
            groupBanner: `http://${req.headers.host}/uploads/${req.files.groupBanner[0].filename}`,
          },
          { where: { id } }
        );
      }

      const group = await Group.update(
        { ...req.body },
        { where: { id } }
      );

      if (!group) {
        const response = new Response(
          false,
          400,
          'Group unsuccessfully updated',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Group updated successfully',
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getUser(req, res) {
    try {
      const { id } = req.params;
      console.log(id);
      const user = await User.findOne(
        {
          where: { id },
          include: [
            { model: WorkHistory, as: 'workHistory' },
            { model: EducationHistory, as: 'educationHistory' },
            {
              model: Friend,
              as: 'friend',
              include: [
                { model: User, as: 'friend' }
              ]
            },
            {
              model: Post,
              as: 'post',
              include: [
                { model: Comment, as: 'comment' }
              ]
            },
            // { model: Group, as: 'group' },
            { model: Mentorship, as: 'mentee' },
            { model: PaymentHistory, as: 'paymentHistory' }
          ]
        },
      );

      if (!user) {
        const response = new Response(
          false,
          400,
          'Error!, User not Found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved',
        { user }
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

  static async updateUserStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const findUser = await User.findOne({ where: { id } });

      if (!findUser) {
        const response = new Response(
          false,
          404,
          'User not found',
        );
        return res.status(response.code).json(response);
      }

      const isStatus = await User.update(
        { status },
        { where: { id } }
      );

      if (!isStatus) {
        const response = new Response(
          false,
          400,
          'Error!, Updating user status',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        `Successfully ${status === 'inactive' ? 'Blocked' : 'Activated'} user account`,
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

  static async deleteUserAccount(req, res) {
    try {
      const { id } = req.params;
      const user = await User.destroy({ where: { id } });

      if (!user) {
        const response = new Response(
          false,
          400,
          'Error! deleting, Try Again!',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Deleted Successfully',
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

  static async deletePost(req, res) {
    try {
      const { postId } = req.params;
      const deletePost = await Post.destroy({ where: { id: postId } });

      if (!deletePost) {
        const response = new Response(
          false,
          400,
          'Post could not deleted'
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Post successfully deleted'
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = new Response(
        false,
        500,
        'Server error, Please try again later'
      );
      return res.status(response.code).json(response);
    }
  }

  static async deleteGroup(req, res) {
    try {
      const { id } = req.params;
      const group = await Group.findOne({ where: { id } });

      if (!group) {
        const response = new Response(
          false,
          400,
          'Error! not found, Try Again!',
        );
        return res.status(response.code).json(response);
      }

      await group.destroy();
      await GroupMember.destroy({ where: { groupId: id } });
      await GroupPost.destroy({ where: { groupId: id } });

      const response = new Response(
        true,
        200,
        'Deleted Successfully',
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

  static async createIceBreaker(req, res) {
    try {
      const { payload } = req.payload;
      const { id: userId } = payload;
      const {
        postText
      } = req.body;
      const post = await Post.create({
        userId,
        postText,
        iceBreaker: true
      });

      if (!post) {
        const response = new Response(
          false,
          401,
          'post could not be saved',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        201,
        'Post successfully created',
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getIceBreakers(req, res) {
    try {
      const post = await Post.findOne(
        {
          where: { iceBreaker: true },
          include: [
            {
              model: Comment,
              as: 'comment',
              include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
            }
          ]
        }
      );

      if (!post) {
        const response = new Response(
          false,
          404,
          'Not found'
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Post successfully retrieved',
        { post }
      );
      return res.status(response.code).json(response);
    } catch (err) {
      const response = new Response(
        false,
        500,
        'Server error, Please try again later'
      );
      return res.status(response.code).json(response);
    }
  }

  static async createPostQuestion(req, res) {
    try {
      const { payload } = req.payload;
      const { id: userId } = payload;
      const {
        postText
      } = req.body;
      const post = await Post.create({
        userId,
        postText,
        question: true
      });

      if (!post) {
        const response = new Response(
          false,
          401,
          'post could not be saved',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        201,
        'Post successfully created',
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async createUser(req, res) {
    try {
      const {
        firstName,
        lastName,
        chickType,
        role
      } = req.body;
      const email = req.body.email.toLowerCase();
      const password = `${lastName.toLowerCase()}${Math.floor((Math.random() * 10000) + 1)}`;
      const hashedPassword = hashPassword(password);
      const user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        onBoardingStep: 0,
        role,
        hasSubscribed: chickType === 'titan',
        chickType
      });

      if (!user) {
        const response = new Response(
          false,
          400,
          'Error! creating user'
        );
        return res.status(response.code).json(response);
      }

      const verificationToken = jwtHelper.generateToken({ email });
      const verificationLink = `https://app.9to5chick.com/auth/verify?token=${verificationToken}`;
      EmailNotifications.activateAccount(email, verificationLink, firstName, password);

      const response = new Response(
        true,
        201,
        'User signup successfully'
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async resendSignUpMail(req, res) {
    try {
      const {
        email,
      } = req.body;

      const findUser = await User.findOne({ where: { email }, attributes: ['firstName'] });

      if (findUser) {
        const verificationToken = jwtHelper.generateToken({ email });
        const verificationLink = `https://app.9to5chick.com/auth/verify?token=${verificationToken}`;
        EmailNotifications.signupEmail(email, verificationLink, findUser.firstName);
      } else {
        const response = new Response(
          false,
          404,
          'Email not found'
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        201,
        'Email resent successfully'
      );
      return res.status(response.code).json(response);
    } catch (err) {
      console.log(err);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async ckImageUpload(req, res) {
    try {
      const imagePath = `http://${req.headers.host}/uploads/${req.file.filename}` || null;

      const response = new Response(
        true,
        201,
        'Image upload successful',
        { imagePath }
      );
      return res.status(200).json(response);
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





  static async sendBroadcastMail(req, res) {
    try {
      const { payload } = req.payload;
      const { id: userId } = payload;

      const { type, to, subject, html, scheduled, date, time, status } = req.body;
      let onlyEmails = [];
      const mails = ["tboy44wiz@gmail.com"]   //   "frostandy41@gmail.com", "ope.adebayo@gmail.com"
      if (scheduled === 'now') {
        if (type.includes("all")) {
          const allSubscribedUsers = await User.findAll({
            where: { hasSubscribed: true }
          });
          //console.log("TYPE>>>>>>>> EMAILS:::", allSubscribedUsers);

          onlyEmails = allSubscribedUsers.map((item) => item.email);
          if (to.length) {
            onlyEmails = [...onlyEmails, ...to];
          }

          if (!onlyEmails.length) {
            const response = new Response(
              false,
              400,
              'No user found'
            );
            return res.status(response.code).json(response);
          }
        }
        else {
          const findUsers = await User.findAll({
            where: { chickType: type, hasSubscribed: true }
          });

          if (!findUsers.length) {
            const response = new Response(
              false,
              404,
              `No user found under ${type} plan`
            );
            return res.status(response.code).json(response);
          }

          onlyEmails = findUsers.map((item) => item.email);
          if (to.length) {
            onlyEmails = [...onlyEmails, ...to];
          }
        }

        //  Save to the DB first.
        const cronTask = await CronTask.create({
          userId,
          subject,
          html,
          type,
          status,
          scheduled,
          emails: onlyEmails,
        });

        if (!cronTask) {
          const response = new Response(
            false,
            400,
            'Error!, creating CronTask',
          );
          return res.status(response.code).json(response);
        }
        const cronTaskId = cronTask.id;
        console.log("NOWNOWNOW >>>>>>>> ", cronTaskId, cronTask.status);

        //  Send Emails.
        mailer.sendBroadcastMail(mails, subject, html)
           .then(r => {
             const statusUpdated = CronTask.update(
               { status: "completed" },
               { where: { id: cronTaskId } }
             );

             if (!statusUpdated) {
               console.log("((((((ERROR====))))");
               const response = new Response(
                 false,
                 400,
                 'Error!, updating Broadcast Mail.',
               );
               return res.status(response.code).json(response);
             }

             const response = new Response(
               true,
               200,
               'Mail Notifications sent successfully',
             );
             return res.status(200).json(response);
           })
          .catch((error) => {
            console.log("////////////////", error.response.body);
            const response = new Response(
              false,
              error.code,
              "Failed to send mail.",
            );
            return res.status(error.code).json(response);
          });
      }
      else {
        //  Extract the Minute, Hour and Day from the date .
        //const mDate = "2020-09-08T18:41:07.068Z";
        const mYear = moment(date).year();
        const mMonth = moment(date).add(1, 'month').month();
        const mDate = moment(date).date();
        const mHour = moment(time).hour();
        const mMinute = moment(time).minute();
        console.log(mMinute, mHour, mDate);

        if (type.includes("all")) {
          const allSubscribedUsers = await User.findAll({
            where: { hasSubscribed: true }
          });
          //console.log("TYPE>>>>>>>> EMAILS:::", allSubscribedUsers);

          onlyEmails = allSubscribedUsers.map((item) => item.email);
          if (to.length) {
            onlyEmails = [...onlyEmails, ...to];
          }

          if (!onlyEmails.length) {
            const response = new Response(
              false,
              400,
              'No user found'
            );
            return res.status(response.code).json(response);
          }
        }
        else {
          const findUsers = await User.findAll({
            where: { chickType: type, hasSubscribed: true }
          });
          //console.log("TYPE<<<<<<<< EMAILS2:::", findUsers);

          if (!findUsers.length) {
            const response = new Response(
              false,
              404,
              `No user found under ${type} plan`
            );
            return res.status(response.code).json(response);
          }

          onlyEmails = findUsers.map((item) => item.email);
          if (to.length) {
            onlyEmails = [...onlyEmails, ...to];
          }
        }

        //  Save to the DB first.
        const cronTask = await CronTask.create({
          userId,
          subject,
          html,
          type,
          year: mYear,
          month: mMonth,
          day: mDate,
          hour: mHour,
          minute: mMinute,
          status,
          scheduled,
          emails: onlyEmails,
        });

        if (!cronTask) {
          const response = new Response(
            false,
            400,
            'Error!, creating CronTask',
          );
          return res.status(response.code).json(response);
        }
        const cronTaskId = cronTask.id;
        console.log("LATER >>>>>>>> ", cronTaskId, cronTask.status);


        //  Send Mail.
        cron.schedule(`${mMinute} ${mHour} ${mDate} * *`, () => {
          console.log(mMinute, mHour, mDate);
          console.log('running a task every minute');

          //const content = template(subject, html || null);
          mailer.sendBroadcastMail(mails, subject, html)
            .then(r => {
              const statusUpdated = CronTask.update(
                { status: "completed" },
                { where: { id: cronTaskId } }
              );

              if (!statusUpdated) {
                console.log("((((((ERROR====))))");
                const response = new Response(
                  false,
                  400,
                  'Error!, updating Broadcast Mail.',
                );
                return res.status(response.code).json(response);
              }
            })
            .catch((error) => {
              console.log("////////////////", error.response.body);
              const response = new Response(
                false,
                error.code,
                "Failed to send mail.",
              );
              return res.status(error.code).json(response);
            });
        });

        const response = new Response(
          true,
          200,
          'Mail Notifications sent successfully',
        );
        return res.status(200).json(response);
      }
    }
    catch (error) {
      console.log(error);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async sendEngagementMail(req, res) {
    try {
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { emailSubject, emailBody, adminPost, usersPost, announcementPost, eventPost, scheduled, date, time } = req.body;
      const content = {
        emailBody,
        posts: [adminPost, usersPost, announcementPost, eventPost]
      }

      let onlyEmails = [];
      const mails = ["tboy44wiz@gmail.com"]  //, "frostandy41@gmail.com", "ope.adebayo@gmail.com"
      if (scheduled === 'now') {
        const allUsers = await User.findAll();
        onlyEmails = allUsers.map((item) => item.email);

        if (!onlyEmails.length) {
          const response = new Response(
            false,
            400,
            'No user found'
          );
          return res.status(response.code).json(response);
        }

        //  Save to the DB first.
        const emailRoundUp = await EmailRoundUp.create({
          userId,
          emailSubject,
          emailBody,
          adminPost,
          usersPost,
          announcementPost,
          eventPost,
          scheduled,
          emails: onlyEmails,
        });

        if (!emailRoundUp) {
          const response = new Response(
            false,
            400,
            'Error!, creating EmailRoundUp',
          );
          return res.status(response.code).json(response);
        }
        const cronTaskId = emailRoundUp.id;
        console.log("NOWNOWNOW >>>>>>>> ", cronTaskId, emailRoundUp.status);

        //  Send Emails.
        await mailer.sendEngagementMail(mails, emailSubject, emailBody, adminPost, usersPost, announcementPost, eventPost)
          .then(r => {
            const statusUpdated = EmailRoundUp.update(
              { status: "completed" },
              { where: { id: cronTaskId } }
            );

            if (!statusUpdated) {
              const response = new Response(
                false,
                400,
                'Error!, updating EmailRoundUp',
              );
              return res.status(response.code).json(response);
            }

            const response = new Response(
              true,
              200,
              'Engagement sent successfully',
            );
            return res.status(200).json(response);
          })
          .catch((error) => {
            console.log("<<<<<<,ERROR>>>>>>", error.response.body);
            const response = new Response(
              false,
              error.code,
              "Failed sending engagement.",
            );
            return res.status(200).json(response);
          });
      }
      else {
        //  Extract the Minute, Hour and Day from the date .
        //const mDate = "2020-09-08T18:41:07.068Z";
        const mYear = moment(date).year();
        const mMonth = moment(date).add(1, 'month').month();
        const mDate = moment(date).date();
        const mHour = moment(time).hour();
        const mMinute = moment(time).minute();
        console.log(mMinute, mHour, mDate, mMonth);

        const allUsers = await User.findAll();
        onlyEmails = allUsers.map((item) => item.email);

        if (!onlyEmails.length) {
          const response = new Response(
            false,
            400,
            'No user found'
          );
          return res.status(response.code).json(response);
        }

        //  Save to the DB first.
        const emailRoundUp = await EmailRoundUp.create({
          userId,
          emailSubject,
          emailBody,
          year: mYear,
          month: mMonth,
          day: mDate,
          hour: mHour,
          minute: mMinute,
          adminPost,
          usersPost,
          announcementPost,
          eventPost,
          scheduled,
          emails: onlyEmails,
        });

        if (!emailRoundUp) {
          const response = new Response(
            false,
            400,
            'Error!, creating EmailRoundUp',
          );
          return res.status(response.code).json(response);
        }
        const cronTaskId = emailRoundUp.id;
        console.log("LATER >>>>>>>> ", cronTaskId, emailRoundUp.status);


        //  Send Mail.
        cron.schedule(`${mMinute} ${mHour} ${mDate} * *`, () => {
          console.log(mMinute, mHour, mDate, mMonth, mYear);
          console.log('running a task every minute');

          //const content = template(subject, html || null);
          mailer.sendEngagementMail(mails, emailSubject,  emailBody, adminPost, usersPost, announcementPost, eventPost)
            .then(r => {
              const statusUpdated = EmailRoundUp.update(
                { status: "completed" },
                { where: { id: cronTaskId } }
              );

              if (!statusUpdated) {
                const response = new Response(
                  false,
                  400,
                  'Error!, updating EmailRoundUp',
                );
                return res.status(response.code).json(response);
              }
            })
            .catch((error) => {
              console.log("<<<<<<,ERROR>>>>>>", error.response);
              const response = new Response(
                false,
                error.code,
                "Failed sending engagement.",
              );
              return res.status(200).json(response);
            });
        });

        const response = new Response(
          true,
          200,
          'Engagement sent successfully',
        );
        return res.status(200).json(response);
      }
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

  static async getAllBroadcastMails(req, res) {
    try {
      const { payload } = req.payload;
      const { id: userId } = payload;

      const cronTasks = await CronTask.findAll();

      if (!cronTasks.length) {
        const response = new Response(
          false,
          404,
          'No post found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved all CronTasks',
        { cronTasks }
      );
      return res.status(response.code).json(response);
    }
    catch (error) {
      console.log(error);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }
  static async getSingleBroadcastMail(req, res) {
    try {
      const { id } = req.params;

      const cronTasks = await CronTask.findOne({
        where: { id }
      });

      if (!cronTasks) {
        const response = new Response(
          false,
          404,
          'No post found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved cronTask',
        { cronTasks }
      );
      return res.status(response.code).json(response);
    }
    catch (error) {
      console.log(error);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getAllEngagementMails(req, res) {
    try {
      const { payload } = req.payload;
      const { id: userId } = payload;

      const roundUps = await EmailRoundUp.findAll();

      if (!roundUps.length) {
        const response = new Response(
          false,
          404,
          'No post found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved all RoundUps',
        { roundUps }
      );
      return res.status(response.code).json(response);
    }
    catch (error) {
      console.log(error);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }
  static async getSingleEngagementMail(req, res) {
    try {
      const { id } = req.params;
      console.log("IDDDD ==== ", id);

      const roundUp = await EmailRoundUp.findOne({
        where: { id }
      });

      if (!roundUp) {
        const response = new Response(
          false,
          404,
          'No post found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved roundUp',
        { roundUp }
      );
      return res.status(response.code).json(response);
    }
    catch (error) {
      console.log(error);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getAllDaysOfTheWeekPosts(req, res) {

    try {
      const { daysOfTheWeek } = req.query;

      const dateOfSelectedDays = [];
      //const weekStartDate = moment().subtract(2, 'week').startOf('week').format();
      const weekStartDate = moment().startOf('week').format();
      if(daysOfTheWeek.includes("Sunday")) {
        dateOfSelectedDays.push(weekStartDate)
      }
      if (daysOfTheWeek.includes("Monday")) {
        dateOfSelectedDays.push(moment(weekStartDate).add(1, 'day').format())
      }
      if (daysOfTheWeek.includes("Tuesday")) {
        dateOfSelectedDays.push(moment(weekStartDate).add(2, 'days').format())
      }
      if (daysOfTheWeek.includes("Wednesday")) {
        dateOfSelectedDays.push(moment(weekStartDate).add(3, 'days').format())
      }
      if (daysOfTheWeek.includes("Thursday")) {
        dateOfSelectedDays.push(moment(weekStartDate).add(4, 'days').format())
      }
      if (daysOfTheWeek.includes("Friday")) {
        dateOfSelectedDays.push(moment(weekStartDate).add(5, 'days').format())
      }
      if (daysOfTheWeek.includes("Saturday")) {
        dateOfSelectedDays.push(moment(weekStartDate).add(6, 'days').format())
      }

      const newArray = dateOfSelectedDays.map((eachItem) => {
        return eachItem.split("T")[0];
      });
      //console.log(newArray)

      let conditions = [];
      for (let x in newArray) {
        conditions.push({
          [Op.or]: Sequelize.where(Sequelize.fn('date', Sequelize.col('created_at')), '=', newArray[x])
        });
      }
      //console.log(conditions);


      const posts = await Post.findAll({
        where: {[Op.or]: conditions}
      });

      if (!posts.length) {
        const response = new Response(
          false,
          404,
          'No post found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved posts',
        { posts }
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

  static async getAdminPosts(req, res) {

    try {
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { period } = req.query;
      const mDayStart = moment().startOf('day').format();
      const mDayEnd = moment().endOf('day').format();

      const mWeekStart = moment().startOf('week').format();
      const mWeekEnd = moment().endOf('week').format();

      const mMonthStart = moment().startOf('month').format();
      const mMonthEnd = moment().endOf('month').format();


      const posts = (period === "Daily") ? (
        await Post.findAll({
          where: {
            userId,
            createdAt: {
              [Op.gte]: mDayStart,
              [Op.lte]: mDayEnd
            }
          }
        })
      ) : (period === "Weekly") ? (
        await Post.findAll({
          where: {
            userId,
            createdAt: {
              [Op.gte]: mWeekStart,
              [Op.lte]: mWeekEnd
            }
          }
        })
      ) : (
        await Post.findAll({
          where: {
            userId,
            createdAt: {
              [Op.gte]: mMonthStart,
              [Op.lte]: mMonthEnd
            }
          }
        })
      )

      if (!posts.length) {
        const response = new Response(
          false,
          400,
          'No post found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved posts',
        { posts }
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

  static async getUsersPost(req, res) {

    try {
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { period } = req.query;
      const mDayStart = moment().startOf('day').format();
      const mDayEnd = moment().endOf('day').format();

      const mWeekStart = moment().startOf('week').format();
      const mWeekEnd = moment().endOf('week').format();

      const mMonthStart = moment().startOf('month').format();
      const mMonthEnd = moment().endOf('month').format();

      const posts = (period === "Daily") ? (
        await Post.findAll({
          where: {
            userId:  {
              [Op.ne]: userId
            },
            createdAt: {
              [Op.gte]: mDayStart,
              [Op.lte]: mDayEnd
            }
          }
        })
      ) : (period === "Weekly") ? (
        await Post.findAll({
          where: {
            userId:  {
              [Op.ne]: userId
            },
            createdAt: {
              [Op.gte]: mWeekStart,
              [Op.lte]: mWeekEnd
            }
          }
        })
      ) : (
        await Post.findAll({
          where: {
            userId:  {
              [Op.ne]: userId
            },
            createdAt: {
              [Op.gte]: mMonthStart,
              [Op.lte]: mMonthEnd
            }
          }
        })
      )

      if (!posts.length) {
        const response = new Response(
          false,
          404,
          'No post found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved posts',
        { posts }
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

  static async getAnnouncement(req, res) {

    try {
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { period } = req.query;
      const mDayStart = moment().startOf('day').format();
      const mDayEnd = moment().endOf('day').format();

      const mWeekStart = moment().startOf('week').format();
      const mWeekEnd = moment().endOf('week').format();

      const mMonthStart = moment().startOf('month').format();
      const mMonthEnd = moment().endOf('month').format();

      const announcement = (period === "Daily") ? (
        await Announcement.findAll({
          where: {
            createdAt: {
              [Op.gte]: mDayStart,
              [Op.lte]: mDayEnd
            }
          }
        })
      ) : (period === "Weekly") ? (
        await Announcement.findAll({
          where: {
            createdAt: {
              [Op.gte]: mWeekStart,
              [Op.lte]: mWeekEnd
            }
          }
        })
      ) : (
        await Announcement.findAll({
          where: {
            createdAt: {
              [Op.gte]: mMonthStart,
              [Op.lte]: mMonthEnd
            }
          }
        })
      )

      //const announcement = await Announcement.findAll();

      if (!announcement.length) {
        const response = new Response(
          false,
          404,
          'No announcement found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved announcement',
        { announcement }
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

  static async getEvents(req, res) {

    try {
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { period } = req.query;
      const mDayStart = moment().startOf('day').format();
      const mDayEnd = moment().endOf('day').format();

      const mWeekStart = moment().startOf('week').format();
      const mWeekEnd = moment().endOf('week').format();

      const mMonthStart = moment().startOf('month').format();
      const mMonthEnd = moment().endOf('month').format();

      const events = (period === "Daily") ? (
        await Event.findAll({
          where: {
            createdAt: {
              [Op.gte]: mDayStart,
              [Op.lte]: mDayEnd
            }
          }
        })
      ) : (period === "Weekly") ? (
        await Event.findAll({
          where: {
            createdAt: {
              [Op.gte]: mWeekStart,
              [Op.lte]: mWeekEnd
            }
          }
        })
      ) : (
        await Event.findAll({
          where: {
            createdAt: {
              [Op.gte]: mMonthStart,
              [Op.lte]: mMonthEnd
            }
          }
        })
      )
      //const events = await Event.findAll();

      if (!events.length) {
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
        'Successfully retrieved events',
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



  static async getDailyPost(req, res) {

    try {
      const { payload } = req.payload;
      const { id: userId } = payload;
      const mDayStart = moment().startOf('day').format();
      const mDayEnd = moment().endOf('day').format();

      const posts = await Post.findAll({
        where: {
          createdAt: {
            [Op.gte]: mDayStart,
            [Op.lte]: mDayEnd
          }
        }
      });

      if (!posts.length) {
        const response = new Response(
          false,
          404,
          'No post found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved posts',
        { posts }
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
  static async getMonthlyPost(req, res) {

    try {
      const { payload } = req.payload;
      const { id: userId } = payload;
      const mMonthStart = moment().startOf('month').format();
      const mMonthEnd = moment().endOf('month').format();

      const posts = await Post.findAll({
        where: {
          createdAt: {
            [Op.gte]: mMonthStart,
            [Op.lte]: mMonthEnd
          }
        }
      });

      if (!posts.length) {
        const response = new Response(
          false,
          404,
          'No post found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved posts',
        { posts }
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

export default Admin;
