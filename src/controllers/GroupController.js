import Sequelize from 'sequelize';
import db from '../database/models';
import Response from '../helpers/Response';
import search from './Helper';

const { getGroupContent, getAllGroupContent } = search;

const { User, Group, GroupMember, GroupComment, GroupPost, GroupPostLike, GroupCommentLike, GroupCommentReply, GroupCommentReplyLike } = db;

class GroupController {
  static async createGroup(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { name, description, isOpen } = req.body;

      const group = await Group.create({
        userId,
        name,
        avatar: req.files['avatar'] ? `http://${req.headers.host}/uploads/${req.files['avatar'][0].filename}` : null,
        description,
        groupBanner: req.files['groupBanner'] ? `http://${req.headers.host}/uploads/${req.files['groupBanner'][0].filename}` : null,
        isOpen
      });

      if(!group){
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

  static async editGroup(req, res){
    try{

      const { payload } = req.payload;
      const { id: userId } = payload;
      // const { name, description, isOpen } = req.body;

      const { id } = req.params;

      // const group = await Group.update({
      //   userId,
      //   name,
      //   avatar: req.files['avatar'] ? `http://${req.headers.host}/uploads/${req.files['avatar'][0].filename}` : null,
      //   description,
      //   groupBanner: req.files['groupBanner'] ? `http://${req.headers.host}/uploads/${req.files['groupBanner'][0].filename}` : null,
      //   isOpen
      // });

      if(req.files['avatar']){
        await Group.update(
          {
            avatar: `http://${req.headers.host}/uploads/${req.files['avatar'][0].filename}`,
          },
          { where: { id, userId }}
        );
      }

      if(req.files['groupBanner']){
        await Group.update(
          {
            groupBanner: `http://${req.headers.host}/uploads/${req.files['groupBanner'][0].filename}`,
          },
          { where: { id, userId }}
        );
      }

      const group = await Group.update(
        { ...req.body },
        { where: { id, userId }}
      );

      if(!group){
        const response = new Response(
          false,
          400,
          'Group unsuccessfully updated',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        201,
        'Group updated successfully',
      );
      return res.status(response.code).json(response);

    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async deleteGroup(req, res){
    try{
      const { payload } = payload;
      const { id: userId } = payload;
      const { groupId } = req.body;

      const checkOwnership = await Group.findOne({ where: { id: groupId,  userId } });

      if(!checkOwnership){
        const response = new Response(
          false,
          400,
          'You do not have permission to delete this group',
        );
        return res.status(response.code).json(response);
      }

      await Group.destroy({ where: { id: groupId } });
      await GroupMember.destroy({ where: { groupId } });

      const response = new Response(
        true,
        200,
        'Group deleted successfully',
      );
      return res.status(response.code).json(response);

    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getAllGroup(req, res){
    try{
      const groups = await Group.findAll({
        include: [
          { model: GroupMember, as: 'groupMember' },
          { model: User, as: 'user' },
          { model: GroupPost, as: 'groupPost' }
        ]
      });

      if(!groups.length){
        const response = new Response(
          false,
          404,
          'No group found',
        );
        return res.status(response.code).json(response);  
      }

      const response = new Response(
        true,
        200,
        'Groups successfully retrieved',
        { groups }
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

  static async getPaginatedGroup(req, res){
    try{
      let { pageNum, pageSize } = req.query;
      // (!pageSize) ? pageSize = 6 : pageSize;
      // (!pageNum) ? pageNum = 1 : pageNum;
      const skips = pageSize * (pageNum - 1);

      const groups = await Group.findAll({
        include: [
          { model: GroupMember, as: 'groupMember' },
          { model: User, as: 'user' },
          { model: GroupPost, as: 'groupPost' }
        ],
        offset: skips,
        limit: pageSize,
      });
      
      const groupCount = await Group.count();

      if(!groups.length){
        const response = new Response(
          false,
          404,
          'No group found',
        );
        return res.status(response.code).json(response);  
      }

      const response = new Response(
        true,
        200,
        'Groups successfully retrieved',
        { groups, groupCount }
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



  static async getMyGroup(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const groups = await GroupMember.findAll(
        { 
          where: { userId },
          include: [
            {
              model: Group,
              as: 'group',
              include: [
                { model: GroupMember, as: 'groupMember' }
              ]
            },
          ],
          order: [['createdAt', 'desc']] 
        }
      );

      if(!groups.length){
        const response = new Response(
          false,
          400,
          'You"re yet to join any group yet',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Groups successfully retrieved',
        { groups }
      );
      return res.status(response.code).json(response);

    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getMyPaginatedGroup(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;

      let { pageNum, pageSize } = req.query;
      const skips = pageSize * (pageNum - 1);
      const groups = await GroupMember.findAll(
        { 
          where: { userId },
          include: [
            {
              model: Group,
              as: 'group',
              include: [
                { model: GroupMember, as: 'groupMember' }
              ]
            },
          ],
          offset: skips,
          limit: pageSize,
          order: [['createdAt', 'desc']] 
        }
      );

      const groupCount = await GroupMember.count(
        { 
          where: { userId },
        }
      );

      if(!groups.length){
        const response = new Response(
          false,
          400,
          'You"re yet to join any group yet',
        );
        return res.status(response.code).json(response);
      }

      console.log(groupCount)

      const response = new Response(
        true,
        200,
        'Groups successfully retrieved',
        { groups, groupCount }
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

  static async getAGroup(req, res){
    try{
      const { id } = req.params;

      const group = await Group.findOne(
        { 
          where: { id },
          include: [
            { model: GroupMember, as: 'groupMember', attributes: ['createdAt' ]},
            { 
              model: GroupPost, as: 'groupPost', attributes: ['createdAt' ]
            }, 
          ],
          order: [['groupPost','createdAt', 'desc']]
        }
      );

      if(!group){
        const response = new Response(
          false,
          404,
          'Error!, Not Found',
        );
        return res.status(response.code).json(response);
      }

      const groupPost = await GroupPost.findAll({ where: { groupId: id } });
      const allGroupPostId = groupPost.map(data => data.id )

      const groupCommentCount  = await GroupComment.findAll({ where: { id: allGroupPostId } });
      const groupLikeCount  = await GroupPostLike.findAll({ where: { id: allGroupPostId } });

      const response = new Response(
        true,
        200,
        'Group successfully found',
        { group, groupCommentCount: groupCommentCount.length, groupLikeCount: groupLikeCount.length }
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

  static async joinGroup(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { groupId } = req.params;

      const check = await GroupMember.findOne({ where: { groupId, userId } });
      if(check){
        const response = new Response(
          false,
          400,
          'Error!, Already registered',
        );
        return res.status(response.code).json(response);
      }

      await GroupMember.create({
        groupId, userId
      });

      const response = new Response(
        true,
        201,
        'Successfully joined',
      );
      return res.status(response.code).json(response);

    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async leaveGroup(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { groupId } = req.params;

      const check = await GroupMember.findOne({ where: { groupId, userId } });
      if(!check){
        const response = new Response(
          false,
          400,
          'Error!, You are not a member of this group',
        );
        return res.status(response.code).json(response);
      }

      await GroupMember.destroy({
        where: { groupId, userId }
      });

      const response = new Response(
        true,
        200,
        'Successfully left',
      );
      return res.status(response.code).json(response);

    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getAllGroupMembers(req, res){
    try{

    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getAGroupMember(req, res){
    try{

    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async checkMembership(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { groupId } = req.params;

      const member = await GroupMember.findOne({ where: { userId, groupId } });
      let isMemeber;
      if(!member){
        isMemeber = false;
        const response = new Response(
          false,
          200,
          'post could not be saved',
        );
        return res.status(response.code).json(response)
      }


    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async createGroupPost(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const {
        groupId, text,
      } = req.body;
      console.log(req.body)

      const post = await GroupPost.create({
        userId,
        groupId,
        text,
        image: req.file ? `http://${req.headers.host}/uploads/${req.file.filename}` : null,
      });

      if(!post){
        const response = new Response(
          false,
          401,
          'post could not be saved',
        );
        return res.status(response.code).json(response)
      }

      const data = await getGroupContent(userId,groupId)
      const { posts } = data;

      const response = new Response(
        true,
        201,
        'Post successfully created',
        { posts }
      );
      return res.status(response.code).json(response);

    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async deleteGroupPost(req, res){
    try{
      const { groupPostId } = req.body;
      const deletePost = await GroupPost.destroy({ where: { id: groupPostId } });

      if(!deletePost){
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

    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getGroupPost(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { groupId } = req.params;

      const member = await GroupMember.findOne({ where: { userId, groupId } });
      let isMember;
      if(!member){
        isMember = false;
      }else {
        isMember = true;
      }

      const reponse = await getGroupContent(userId, groupId);
      
      const { posts, user, commentLikes, allLikes, group, groupCommentReplyLikes } = reponse;
      const response = new Response(
        true,
        200,
        'Posts succefully retrieved',
        { posts, user, commentLikes, allLikes, isMember, group, groupCommentReplyLikes }
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

  static async getAllGroupPost(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;

      // const member = await GroupMember.findOne({ where: { userId, groupId } });
      // let isMember;
      // if(!member){
      //   isMember = false;
      // }else {
      //   isMember = true;
      // }

      const reponse = await getAllGroupContent(userId);
      
      const { posts, user, commentLikes, allLikes, groupCommentReplyLikes } = reponse;
      // const { mygroups } = data;
      const response = new Response(
        true,
        200,
        'Posts succefully retrieved',
        { posts, user, commentLikes, allLikes, groupCommentReplyLikes }
        // { posts }

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

  static async createGroupComment(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { groupPostId, comment, groupId } = req.body

      const postComment = await GroupComment.create({
        userId, groupPostId, comment
      });

      if(!postComment){
        const response = new Response(
          false,
          400,
          'Comment not saved',
        );
        return res.status(response.code).json(response);
      }

      const reponse = await getGroupContent(userId, groupId);
      const { posts } = reponse;

      const response = new Response(
        true,
        201,
        'Comment successfully created',
        { posts }
        // { posts, user, commentLikes, allLikes }
      );
      return res.status(response.code).json(response);

    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async getAllGroupComment(req, res){
    try{

    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async deleteGroupComment(req, res){
    try{
      const { groupCommentId } = req.body;

      const deleteComment = await GroupComment.destroy({ where: { id: groupCommentId } })

      if(!deleteComment){
        const response = new Response(
          false,
          400,
          'Comment could not be deleted'
        );
        return res.status(response.code).json(response);
      }

      await GroupCommentLike.destroy({ where: { groupCommentId } })

      const response = new Response(
        true,
        200,
        'Comment successfully deleted'
      );
      return res.status(response.code).json(response);

    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async togglePostLike(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { groupPostId, groupId } = req.body;

      const data = await getGroupContent(userId, groupId)
      const { posts, commentLikes, allLikes } = data;

      const isLike = await GroupPostLike.findOne(
        {
          where: { userId, groupPostId } 
        }
      );
      
      // Unlike Post
      if (isLike) {
        await GroupPostLike.destroy({ where: { userId, groupPostId } })
        const response = new Response(
          true,
          200,
          'User succefully unliked post',
          { posts, commentLikes, allLikes }
        );
        return res.status(response.code).json(response);
      }

      const like = await GroupPostLike.create({
        userId,
        groupPostId
      });

      if(!like){
        const response = new Response(
          false,
          500,
          'Something went wrong. Please retry'
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'User succefully liked post',
        { posts, commentLikes, allLikes }
      );
      return res.status(response.code).json(response);

    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async toggleCommentLike(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { groupPostId, groupCommentId, groupId } = req.body;

      const data = await getGroupContent(userId, groupId)
      const { posts, commentLikes, allLikes } = data;

      const isLike = await GroupCommentLike.findOne(
        {
          where: { userId, groupPostId, groupCommentId } 
        }
      );

      // Unlike Comment
      if(isLike){
        const unlikeComment = await GroupCommentLike.destroy({ where: { userId, groupPostId, groupCommentId } })

        if(!unlikeComment){
          const response = new Response(
            false,
            400,
            'Comment could not be unliked',
          );
          return res.status(response.code).json(response);
        }

        const response = new Response(
          true,
          200,
          'User succefully unliked comment',
          { posts, commentLikes, allLikes }
        );
        return res.status(response.code).json(response);
      }

      await GroupCommentLike.create({
        userId, groupPostId, groupCommentId
      });

      const response = new Response(
        true,
        200,
        'Comment successfully liked',
        { posts, commentLikes, allLikes }
      );
      return res.status(response.code).json(response);

    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async sendGroupCommentReply(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { groupCommentId, comment, groupId } = req.body

      const postCommentReply = await GroupCommentReply.create({
        userId, groupCommentId, comment
      });

      if(!postCommentReply){
        const response = new Response(
          false,
          400,
          'Comment not saved',
        );
        return res.status(response.code).json(response);
      }

      // const data = await getFeedContents(userId);
      // const { posts, user, commentLikes, allLikes, commentReplyLikes } = data;
      if(groupId){
        const reponse = await getGroupContent(userId, groupId);
        const { posts } = reponse;
  
        const response = new Response(
          true,
          201,
          'Comment successfully created',
          { posts }
        );
        return res.status(response.code).json(response);
      } else {
        const response = new Response(
          true,
          201,
          'Comment successfully created',
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

  static async deleteGroupCommentReply(req, res){
    try{
      const { groupCommentReplyId } = req.body;

      const deleteCommentReply = await GroupCommentReply.destroy({ where: { id: groupCommentReplyId } })

      if(!deleteCommentReply){
        const response = new Response(
          false,
          400,
          'Comment could not be deleted'
        );
        return res.status(response.code).json(response);
      }

      await GroupCommentReplyLike.destroy({ where: { groupCommentReplyId } })

      const response = new Response(
        true,
        200,
        'Comment successfully deleted'
      );
      return res.status(response.code).json(response);

    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async toggleCommentReplyLike(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { groupCommentId, groupCommentReplyId, groupId } = req.body;

      const reponse = await getGroupContent(userId, groupId);
      const { posts, user, commentLikes, allLikes, group, groupCommentReplyLikes } = reponse;

      const isLike = await GroupCommentReplyLike.findOne(
        {
          where: { userId, groupCommentId, groupCommentReplyId } 
        }
      );

      // Unlike Comment
      if(isLike){
        const unlikeComment = await GroupCommentReplyLike.destroy({ where: { userId, groupCommentId, groupCommentReplyId } })

        if(!unlikeComment){
          const response = new Response(
            false,
            400,
            'Comment could not be unliked'
          );
          return res.status(response.code).json(response);
        }

        const response = new Response(
          true,
          200,
          'User succefully unliked comment',
          { posts, user, commentLikes, allLikes, group, groupCommentReplyLikes }
        );
        return res.status(response.code).json(response);
      }

      const likeComment = await GroupCommentReplyLike.create({
        userId, groupCommentId, groupCommentReplyId
      });

      if(!likeComment){
        const response = new Response(
          false,
          400,
          'Comment could not be liked'
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Comment successfully liked',
        { posts, user, commentLikes, allLikes, group, groupCommentReplyLikes }
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

  static async getMenteeGroups(req, res){
    try{
      const { id } = req.params;
      const groups = await GroupMember.findAll(
        { 
          where: { userId: id },
          include: [
            {
              model: Group,
              as: 'group',
              include: [
                { model: GroupMember, as: 'groupMember' }
              ]
            },
          ],
          order: [['createdAt', 'desc']] 
        }
      );

      if(!groups.length){
        const response = new Response(
          false,
          400,
          'You"re yet to join any group yet',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Groups successfully retrieved',
        { groups }
      );
      return res.status(response.code).json(response);

    } catch(err){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async updateGroupImage(req, res){
    try{ 
      const { payload } = req.payload;
      const { id: userId } = payload;
      console.log(req.file, req.body)

      const { isImageFor, groupId } = req.body;
      let group;

      const checkOwnership = await Group.findOne({
        where: { id: groupId }
      });

      if(!checkOwnership){
        const response = new Response(
          false,
          400,
          'Error, Group does not exist'
        );
        return res.status(response.code).json(response);
      }

      if(checkOwnership.userId !== userId){
        const response = new Response(
          false,
          400,
          'You are not authorised to change this image'
        );
        return res.status(response.code).json(response);
      }

      if(isImageFor === 'avatar'){
        group = await Group.update(
          {
            avatar: req.file ? `http://${req.headers.host}/uploads/${req.file.filename}` : null,
          },
          { 
            where: { userId, id: groupId },
            returning: true,
            plain: true
          }
        );
      }

      if(isImageFor === 'groupBanner'){
        group = await Group.update(
          {
            groupBanner: req.file ? `http://${req.headers.host}/uploads/${req.file.filename}` : null,
          },
          { 
            where: { userId, id: groupId },
            returning: true,
            plain: true
          }
        );
      }

      if(!group){
        const response = new Response(
          false,
          400,
          'Error, try again!'
        );
        return res.status(response.code).json(response);
      };

      // const data = await getUserDetails(email)
      // const { userDetails } = data;

      // const token = jwtHelper.generateToken({
      //   id: userDetails.id,
      //   email,
      //   role: userDetails.role,
      //   status: userDetails.status,
      //   userDetails
      // });

      const response = new Response(
        true,
        200,
        'Successfully updated',
        // {userDetails, token }
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

}

export default GroupController;
