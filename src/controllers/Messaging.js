import db from '../database/models';
import Sequelize from 'sequelize';
import Response from '../helpers/Response';
import search from './Helper';

const Op = Sequelize.Op;
const { User, Friend, Message } = db;

class Messaging {
  // Send Message to a friend
  static async sendMessage(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const {
        text, recipentId
      } = req.body;
      
      const checkRecipentExists = await User.findOne({ where: { id: recipentId } });
      const checkSender = await Friend.findOne({ where: { userId, friendId: recipentId } });
      const checkRecipent = await Friend.findOne({ where: { userId: recipentId, friendId: userId } });

      if(!checkRecipentExists){
        const response = new Response(
          false,
          404,
          'Message not sent, recipent not found',
        );
        return res.status(response.code).json(response);
      }

      const message = await Message.create({
        text,
        image: req.file ? `http://${req.headers.host}/uploads/${req.file.filename}` : null,
        recipentId, senderId: userId
      });

      if(!message){
        const response = new Response(
          false,
          400,
          'Message could not be saved',
        );
        return res.status(response.code).json(response);
      }

      if(!checkSender.chatHistory) {
        await Friend.update(
          { chatHistory: true }, 
          { where: { userId, friendId: recipentId, },
          returning: true,
          plain: true
        });
      }

      if(!checkRecipent.chatHistory) {
        await Friend.update(
          { chatHistory: true }, 
          { where: { userId: recipentId, friendId: userId, },
          returning: true,
          plain: true
        });
      }

      const response = new Response(
        true,
        201,
        'Message sent successfully',
      );
      return res.status(response.code).json(response)

    } catch(err){
      console.log(err)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getFriendsWithMssgHistory(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      
      const friends = await Friend.findAll(
        { 
          where: { userId, status: 'accepted', chatHistory: true },
          include: [
            {
              model: User,
              as: 'friend',
              attributes: ['firstName', 'lastName', 'avatar', 'city', 'country'],
              include: [ { model: Friend, as: 'friend'}]
            }
          ]
        }
      );
      // let friendsWithChatHistory = [];
      // for(let i = 0; i < friends.length; i++){
      //   const messages = await Message.findOne(
      //     { 
      //       where: {
      //         [Op.or]: [ {senderId: userId, recipentId: friends[i].friendId}, {recipentId: userId, senderId: friends[i].friendId} ]
      //       }, 
      //     }
      //   );
      //   friendsWithChatHistory.push(messages);
      // }
      if(!friends.length){
        const response = new Response(
          false,
          400,
          'No user with chat history found',
        );
        return res.status(response.code).json(response);
      }
      
      const response = new Response(
        true,
        200,
        'Networks with chat history successfully retrieved',
        { friends }
      );
      return res.status(response.code).json(response);
    }catch(err){
      console.log(err)
    }
  }

  static async getFriendsWithoutHistory(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      // console.log(userId)

      const friendsWithHistory = await Friend.findAll(
        { 
          where: { userId, status: 'accepted', chatHistory: true },
          include: [
            {
              model: User,
              as: 'friend',
              attributes: ['firstName', 'lastName', 'avatar', 'city', 'country'],
              include: [ { model: Friend, as: 'friend'}]
            }
          ]
        }
      );

      const friendsList = friendsWithHistory.map(data => data.friendId );

      const friends = await Friend.findAll(
        { 
          where: { userId, status: 'accepted', friendId: { [Op.notIn]: friendsList } },
          include: [
            {
              model: User,
              as: 'friend',
              attributes: ['firstName', 'lastName', 'avatar', 'city', 'country'],
              include: [ { model: Friend, as: 'friend'}]
            }
          ] 
        }
      );

      if(!friends.length){
        const response = new Response(
          false,
          400,
          'No Friend Fround',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Success',
        { friends }
      );
      return res.status(response.code).json(response);

    }catch(err) {
      console.log(err)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  // Get Messages between User and Friend
  static async getMessages(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { recipentId } = req.params;

      const messages = await Message.findAll(
        { 
          where: {
            [Op.or]: [ {senderId: userId, recipentId}, {recipentId: userId, senderId: recipentId} ],
          },
          order: [['createdAt', 'asc']] 
        }
      );

      await Message.update(
        {
          status: true
        },
        { 
          where: {
            recipentId: userId, senderId: recipentId
          }, 
        }
      );

      if(!messages.length){
        const response = new Response(
          false,
          400,
          'No message found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Message successfully retrieved',
        { messages }
      );
      return res.status(response.code).json(response);

    } catch(err){
      console.log(err)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getUnreadMessage(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;

      const messages = await Message.findAll(
        {
          where: { recipentId: userId, status: false },
          include: [
            { model: User, as: 'sender' }
          ]
        }
      );

      if(!messages.length){
        const response = new Response(
          false,
          400,
          'No message found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        `You have ${messages.length} unread messages`,
        { messages }
      );
      return res.status(response.code).json(response);

    } catch(err){
      console.log(err)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  // static async sendMessage(req, res){
  //   try{

  //   } catch(err){
      
  //   }
  // }
}

export default Messaging;
