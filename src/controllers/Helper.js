import db from '../database/models';

const { 
  User, 
  Post, 
  Like, 
  CommentLike, 
  Comment, 
  GroupPost, 
  Group, 
  GroupComment, 
  GroupCommentLike, 
  GroupPostLike,
  GroupMember,
  Friend,
  WorkHistory ,
  EducationHistory,
  Goal,
  CommentReply,
  CommentReplyLike,
  GroupCommentReply,
  GroupCommentReplyLike,
  Mentorship,
  Subscription
} = db;

class SearchDatabase {

  static async getUserDetails (email){
    const userDetails = await User.scope('withoutPassword').findOne(
      { 
        where: { email },
        include: [
          { 
            model: Friend,
            as: 'friend', attributes: ['id'],
            include: [
              { model: User, as: 'friend', attributes: ['avatar']}
            ]
          },
          { 
            model: WorkHistory,
            as: 'workHistory'
          },
          { 
            model: EducationHistory,
            as: 'educationHistory'
          },
          { 
            model: Goal,
            as: 'goal'
          },
          {
            model: Mentorship,
            as: 'mentee',
            include: [
              { model: User, as: 'mentor'}
            ]
          },
          {
            model: Mentorship,
            as: 'mentor',
            include: [
              { model: User, as: 'mentee'}
            ]
          },
          { 
            model: Subscription,
            as: 'subscription',
            attributes: ['subscriptionCode']
          },
        ]
      },
    );
    const data = {userDetails}
    return data;
  }

  static async getFeedContents (userId) {
    const posts = await Post.findAll(
      {
        // where: { userId },
        include: [
          {
            model: Comment,
            as: 'comment',
            // order: 'id',
            attributes: ['id', 'userId', 'postId', 'comment', 'createdAt'],
            include: [
              { model: User, as: 'user' },
              { model: CommentLike, as: 'commentLike'},
              { 
                model: CommentReply,
                as: 'commentReply',
                attributes: ['id', 'userId', 'commentId', 'comment', 'createdAt'],
                include: [
                  { model: User, as: 'user' },
                  { model: CommentReplyLike, as: 'commentReplyLike'},
                ] 
              }
            ],
          },
          {
            model: Like,
            as: 'like',
            include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'createdAt'] } ]
          },
          {
            model: User,
            as: 'user',
          },
        ],
        // order: [['comment','createdAt', 'desc'], ['createdAt', 'desc']]
        order: [['createdAt', 'desc']]
      }
    );
  
    const user = await User.scope('withoutPassword').findOne({ where: { id: userId } });
  
    const myLikes = await Like.findAll(
      { 
        where: { userId },
      }
    );
    const allLikes = myLikes.map(data => data.postId )
  
    const myCommentLikes = await CommentLike.findAll(
      { 
        where: { userId },
      }
    );
    const commentLikes = myCommentLikes.map(data => {
      return data.commentId + ',' + data.postId })

    const myCommentReplyLikes = await CommentReplyLike.findAll(
      { 
        where: { userId },
      }
    );
    const commentReplyLikes = myCommentReplyLikes.map(data => {
      return data.commentReplyId + ',' + data.commentId })
  
    const data = {
      posts, user, commentLikes, allLikes, commentReplyLikes
    }
    return data;
  }

  // static async updateUser(data, email) {
  //   await User.update(
  //     { data },
  //     { 
  //       where: { email },
  //       returning: true,
  //     }
  //   );

  //   return 
  // }

  static async getGroupContent (userId, groupId) {
    const posts = await GroupPost.findAll(
      {
        where: { groupId },
        include: [
          {
            model: GroupComment,
            as: 'groupComment',
            // order: 'id',
            attributes: ['id', 'userId', 'groupPostId', 'comment', 'createdAt'],
            include: [
              { model: User, as: 'user' },
              { model: GroupCommentLike, as: 'groupCommentLike'},
              { 
                model: GroupCommentReply,
                as: 'groupCommentReply',
                attributes: ['id', 'userId', 'groupCommentId', 'comment', 'createdAt'],
                include: [
                  { model: User, as: 'user' },
                  { model: GroupCommentReplyLike, as: 'groupCommentReplyLike'},
                ] 
              }
            ],
          },
          {
            model: GroupPostLike,
            as: 'groupPostLike',
          },
          {
            model: User,
            as: 'user',
          },
        ],
        order: [['groupComment','createdAt', 'asc']]
      }
    );

    const group = await Group.findOne({ 
      where: { id: groupId },
      include: [ { model: GroupMember, as: 'groupMember', attributes: ['userId'] } ] 
    });
  
    const user = await User.scope('withoutPassword').findOne({ where: { id: userId } });
  
    const myLikes = await GroupPostLike.findAll(
      { 
        where: { userId },
      }
    );
    const allLikes = myLikes.map(data => data.postId )
  
    const myCommentLikes = await GroupCommentLike.findAll(
      { 
        where: { userId },
      }
    );
    const commentLikes = myCommentLikes.map(data => {
      return data.commentId + ',' + data.postId });

    const myGroupCommentReplyLikes = await GroupCommentReplyLike.findAll(
      { 
        where: { userId },
      }
    );
    const groupCommentReplyLikes = myGroupCommentReplyLikes.map(data => {
      return data.groupCommentReplyId + ',' + data.groupCommentId });
  
    const data = {
      posts, user, commentLikes, allLikes, group, groupCommentReplyLikes
    }
    return data;
  }

  static async getAllGroupContent (userId) {
    const mygroups = await GroupMember.findAll({ where: { userId }, attributes: ['groupId'] });

    const mygroupsList = mygroups.map(data => data.groupId)
    // const data = mygroupsList;
    // return data;

    // const posts = await GroupPost.findAll({
    //   where: { id: [1,2]  }
    // })

    // const data = { posts };
    // return data;

    const posts = await GroupPost.findAll(
      {
        where: { groupId: mygroupsList },
        include: [
          {
            model: GroupComment,
            as: 'groupComment',
            // order: 'id',
            attributes: ['id', 'userId', 'groupPostId', 'comment', 'createdAt'],
            include: [
              { model: User, as: 'user' },
              { model: GroupCommentLike, as: 'groupCommentLike'},
              { 
                model: GroupCommentReply,
                as: 'groupCommentReply',
                attributes: ['id', 'userId', 'groupCommentId', 'comment', 'createdAt'],
                include: [
                  { model: User, as: 'user' },
                  { model: GroupCommentReplyLike, as: 'groupCommentReplyLike'},
                ] 
              }
            ],
          },
          {
            model: GroupPostLike,
            as: 'groupPostLike',
          },
          {
            model: User,
            as: 'user',
          },
          {
            model: Group,
            as: 'group',
          },
        ],
        order: [['groupComment','createdAt', 'asc']]
      }
    );

    // const group = await Group.findOne({ where: { id: groupId } });
  
    const user = await User.scope('withoutPassword').findOne({ where: { id: userId } });
  
    const myLikes = await GroupPostLike.findAll(
      { 
        where: { userId },
      }
    );
    const allLikes = myLikes.map(data => data.postId )
  
    const myCommentLikes = await GroupCommentLike.findAll(
      { 
        where: { userId },
      }
    );
    const commentLikes = myCommentLikes.map(data => {
      return data.groupCommentId + ',' + data.groupPostId });

    const myGroupCommentReplyLikes = await GroupCommentReplyLike.findAll(
      { 
        where: { userId },
      }
    );
    const groupCommentReplyLikes = myGroupCommentReplyLikes.map(data => {
      return data.groupCommentReplyId + ',' + data.groupCommentId });
  
    const data = {
      posts, user, commentLikes, allLikes, groupCommentReplyLikes
    }
    return data;
  }

}

export default SearchDatabase;