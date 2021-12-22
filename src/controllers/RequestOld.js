import db from '../database/models';
import Sequelize from 'sequelize';
import Response from '../helpers/Response';
import search from './Helper';

const Op = Sequelize.Op;
const { User, Friend } = db;

class Request {
  static async sendRequest(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { friendId } = req.params;
      console.log(userId)
      const isFriend = await Friend.findOne({
        where: { userId, friendId }
      });
      const isFriendOf = await Friend.findOne({
        where: { userId: friendId, friendId: userId }
      });
      if(isFriend || isFriendOf){
        const response = new Response(
          false,
          400,
          'Already added as friend',
        );
        return res.status(response.code).json(response)
      }

      const friend = await Friend.create({
        userId, friendId
      });

      if(!friend){
        const response = new Response(
          false,
          400,
          'Friend not saved',
        );
        return res.status(response.code).json(response)
      }

      const response = new Response(
        true,
        201,
        'Friend Request sent',
      );
      return res.status(response.code).json(response)


    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getFriends(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;

      // const friends = await Friend.findAll({ where: userId })
      const friends = await Friend.findAll(
        { 
          where: {
            [Op.or]: [{userId, status: 'accepted'}, {friendId: userId, status: 'accepted' }] 
          },
          // include: [
          //   {
          //     model: Friend,
          //     as: 'friend',
          //   }
          // ] 
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

  static async getUser(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;

      const users = await User.findOne({
        where: { userId },
        include: [
          {
            model: Friend,
            as: 'friend'
          }
        ]
      });

      if(!iusers){
        return res.status(200).json({ message: 'no foudn'});
      }

      return res.status(200).json({ data: { users } });
      

    } catch(err){
      console.log(err)
    }
  }

  static async getFriendRequests(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;

      // const friends = await Friend.findAll({ where: userId })
      const friends = await Friend.findAll(
        { 
          where: {
            [Op.or]: [{userId, status: 'pending'}, {friendId: userId, status: 'pending' }] 
          },
          include: [
            {
              model: User,
              as: 'user',
            },
            {
              model: User,
              as: 'friend'
            }
          ] 
        }
      );

      // const list = friends.map(data => data.friendId == userId || data.userId == userId)


      if(!friends){
        const response = new Response(
          false,
          400,
          'Not friend request found',
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
}

export default Request;
