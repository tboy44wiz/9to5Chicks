import db from '../database/models';
import Sequelize from 'sequelize';
import Response from '../helpers/Response';
import search from './Helper';

const Op = Sequelize.Op;
const { User, Friend, Group, GroupMember } = db;

class Request {
  static async sendRequest(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { friendId } = req.params;

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
          'You have a pending connection request already',
        );
        return res.status(response.code).json(response)
      }

      const friend = await Friend.create({
        userId, friendId, invites: 'sent'
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
      console.log(err)
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
      // console.log(userId)

      // const friends = await Friend.findAll({ where: userId })
      const friends = await Friend.findAll(
        { 
          where: { userId, status: 'accepted' },
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

  static async getFriendRequests(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;

      const friends = await Friend.findAll(
        { 
          where: {
            friendId: userId, status: 'pending'
          },
          include: [
            {
              model: User,
              as: 'user',
            },
          ] 
        }
      );

      if(!friends.length){
        const response = new Response(
          false,
          400,
          'No friend request found',
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

  static async acceptFriendRequest(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      // const { requestId } = req.params;
      const { status, requesterId } = req.body;

      const checkStatus = await Friend.findOne({ where: { friendId: userId, userId: requesterId, status: 'pending' }});

      if(!checkStatus){
        const response = new Response(
          false,
          400,
          'Friend request not found !',
        );
        return res.status(response.code).json(response);
      }

      const user = await Friend.update(
        { status },
        {
          where: { friendId: userId, userId: requesterId, status: 'pending' },
        }
      );

      if(!user){
        const response = new Response(
          false,
          400,
          'Error occured!',
        );
        return res.status(response.code).json(response);
      }

      if( status === 'rejected'){
        await Friend.destroy({ where: { friendId: userId, userId: requesterId, status: 'rejected' } });

        const response = new Response(
          true,
          200,
          'Friend Request Rejected Successfully',
        );
        return res.status(response.code).json(response);
      }

      if(status === 'accepted'){
        await Friend.create(
          { userId, friendId: requesterId, status: 'accepted', invites: 'accepted' }
        );

        const response = new Response(
          true,
          200,
          'Friend Request Accepted Successfully',
        );
        return res.status(response.code).json(response);
      }
      

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

  // static async findUsersBasedOnOccupation(req, res){
  //   try{
  //     const { payload } = req.payload;
  //     const { email } = payload;

  //     const meUser = await User.findOne({ where: { email } })

  //     // const friends = await Friend.findAll({ where: userId })
  //     const users = await User.findAll(
  //       { 
  //         where: { jobTitle: meUser.jobTitle },
  //         include: [
  //           {
  //             model: Friend,
  //             as: 'friend',
  //           },
  //         ]
  //       }
  //     );

  //     if(!users.length){
  //       const response = new Response(
  //         false,
  //         400,
  //         'No User with Similar Occupation Fround',
  //       );
  //       return res.status(response.code).json(response);
  //     }

  //     const response = new Response(
  //       true,
  //       200,
  //       'Users with similar occupation',
  //       { users }
  //     );
  //     return res.status(response.code).json(response);

  //   }catch(err) {
  //     console.log(err)
  //     const response = new Response(
  //       false,
  //       500,
  //       'Server error, Please try again later',
  //     );
  //     return res.status(response.code).json(response);
  //   }
  // }

  static async findUsersBasedOnOccupation(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId, email } = payload;

      const meUser = await User.findOne({ where: { email } })

      const myFriends = await Friend.findAll(
        { 
          where: { userId, status: ['accepted', 'pending', 'rejected'] },
        }
      );

      const myFriendRequests = await Friend.findAll(
        { 
          where: { friendId: userId, status: ['accepted', 'pending', 'rejected'] },
        }
      );

      const friendsList = myFriends.map(data => data.friendId );
      const friendRequests = myFriendRequests.map(data => data.userId);

      const newFriendsList = [...friendsList, ...friendRequests, userId];

      // const friends = await Friend.findAll({ where: userId })
      const users = await User.findAll(
        { 
          where: { jobTitle: meUser.jobTitle, id: { [Op.notIn]: newFriendsList }, hasSubscribed: true },
          attributes: ['id', 'firstName', 'lastName', 'avatar'],
          include: [
            {
              model: Friend,
              as: 'friend',
              attributes: ['id'],
            },
          ]
        }
      );

      // if(!users.length){
      //   const response = new Response(
      //     false,
      //     400,
      //     'No User with Similar Occupation Found',
      //   );
      //   return res.status(response.code).json(response);
      // }

      // let foundUsers = [];
      // users.forEach(data => {
      //   if(!myFriends.includes(data.id)){
      //     ans.push(data);
      //   }
      // })

      const response = new Response(
        true,
        200,
        'Users with similar occupation',
        { users }
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

  static async findUsersBasedOnGroup(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId, email } = payload;

      // const meUser = await User.findOne({ where: { email } })

      const myFriends = await Friend.findAll(
        { 
          where: { userId, status: ['accepted', 'pending', 'rejected'] },
        }
      );

      const myFriendRequests = await Friend.findAll(
        { 
          where: { friendId: userId, status: ['accepted', 'pending', 'rejected'] },
        }
      );

      const friendsList = myFriends.map(data => data.friendId );
      const friendRequests = myFriendRequests.map(data => data.userId);

      const newFriendsList = [...friendsList, ...friendRequests, userId];

      const myGroups = await GroupMember.findAll(
        { where: { userId } }
      );

      const myGroupList = myGroups.map(data => data.groupId);

      const groupMembers = await GroupMember.findAll(
        {
          where: { groupId: { [Op.in]: myGroupList }, userId: { [Op.notIn]: newFriendsList } },
          // include: [
          //   {
          //     model: Group,
          //     as: 'group'
          //   }
          // ]
        }
      );

      const myGroupMembersList = groupMembers.map(data => data.userId);

      const users = await User.findAll(
        { 
          where: { id: { [Op.in]: myGroupMembersList }},
          attributes: ['id', 'firstName', 'lastName', 'avatar'],
          include: [
            {
              model: Friend,
              as: 'friend',
              attributes: ['id'],
            },
          ]
        }
      );

      // if(!users.length){
      //   const response = new Response(
      //     false,
      //     400,
      //     'No User with Similar Group Found',
      //   );
      //   return res.status(response.code).json(response);
      // }

      const response = new Response(
        true,
        200,
        'Users with similar occupation',
        { users }
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

  static async findUserBasedOnHobbiesInterest(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId, email } = payload;

      const meUser = await User.findOne({ where: { email } })

      const myFriends = await Friend.findAll(
        { 
          where: { userId, status: ['accepted', 'pending', 'rejected'] },
        }
      );

      const friendsList = myFriends.map(data => data.friendId );

      const newFriendsList = [...friendsList, userId];

      const users = await User.findAll({ 
        where: {
          hobbies: {
            [Op.like]: { [Op.any]: ['%Photography%', '%Drink%'], hasSubscribed: true }
          }
        }
      });

      if(!users.length){
        const response = new Response(
          false,
          404,
          'No User Found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully',
        { users }
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

  static async findAllUsers(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId, email } = payload;

      const isAdmin = await User.findOne({ where: { role: 'admin' }});
      const { id: adminId } = isAdmin;
      

      const myFriends = await Friend.findAll(
        { 
          where: { userId, status: ['accepted'] },
        }
      );

      const pendingFriends = await Friend.findAll(
        { 
          where: { userId, status: ['pending'] },
        }
      );

      const friendsList = myFriends.map(data => data.friendId );
      const pendingList = pendingFriends.map(data => data.friendId );

      const removeList = [userId, adminId];
      console.log(userId)
      const users = await User.findAll(
        { 
          where: { id: { [Op.notIn]: removeList }, hasSubscribed: true},
          include: [
            {
              model: Friend,
              as: 'friend',
            },
          ],
        }
      );

      if(!users.length){
        const response = new Response(
          false,
          400,
          'No User found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'All Users sussessfullt retrieved',
        { users, friendsList, pendingList }
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
