import db from '../database/models';
import Response from '../helpers/Response';
import search from './Helper';

const { getFeedContents } = search;

const { User, Post, Like, CommentLike, Comment, Network, CommentReply, CommentReplyLike,
  FlagPost
} = db;

class Communities {
  static async getMembersByInterests(req, res){
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

  static async likeOrUnlikePost(req, res){
    try {
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { postId } = req.body;

      const isLike = await Like.findOne(
        {
          where: { userId, postId } 
        }
      );
      
      // Unlike Post
      if (isLike) {
        await Like.destroy({ where: { userId, postId } })
        const response = new Response(
          true,
          200,
          'User succefully unliked post'
        );
        return res.status(response.code).json(response);
      }

      const like = await Like.create({
        userId,
        postId
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
        'User succefully liked post'
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

  static async sendUserPost(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const {
        postText
      } = req.body;
      //console.log(req.body)
      const post = await Post.create({
        // id: 49,
        userId,
        postImage: req.file ? `http://${req.headers.host}/uploads/${req.file.filename}` : null,
        postText
      })

      if(!post){
        const response = new Response(
          false,
          401,
          'post could not be saved',
        );
        return res.status(response.code).json(response);
      }

      const data = await getFeedContents(userId)
      const { posts } = data;

      const response = new Response(
        true,
        201,
        'Post successfully created',
        { posts }
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

  static async sendComment(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { postId, comment } = req.body

      const postComment = await Comment.create({
        userId, postId, comment
      });

      if(!postComment){
        const response = new Response(
          false,
          400,
          'Comment not saved',
        );
        return res.status(response.code).json(response);
      }

      const data = await getFeedContents(userId);
      const { posts, user, commentLikes, allLikes, commentReplyLikes } = data;

      const response = new Response(
        true,
        201,
        'Comment successfully created',
        { posts, user, commentLikes, allLikes, commentReplyLikes }
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

  static async likeUserComment(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { postId, commentId } = req.body;

      const data = await getFeedContents(userId);
      const { posts, user, commentLikes, allLikes, commentReplyLikes } = data;

      const isLike = await CommentLike.findOne(
        {
          where: { userId, postId, commentId } 
        }
      );

      // Unlike Comment
      if(isLike){
        const unlikeComment = await CommentLike.destroy({ where: { userId, postId, commentId } })

        if(!unlikeComment){
          const response = new Response(
            false,
            400,
            'Comment could not be unliked'
          );
          return res.status(response.code).json(response);
        }

        // const data = await getFeedContents(userId);
        // const { posts, user, commentLikes, allLikes } = data;

        const response = new Response(
          true,
          200,
          'User succefully unliked comment',
          { posts, user, commentLikes, allLikes, commentReplyLikes }
        );
        return res.status(response.code).json(response);
      }

      const likeComment = await CommentLike.create({
        userId, postId, commentId
      });

      // if(!likeComment){
      //   const response = new Response(
      //     false,
      //     400,
      //     'Comment could not be liked'
      //   );
      //   return res.status(response.code).json(response);
      // };

      // const data = await getFeedContents(userId);
      // const { posts, user, commentLikes, allLikes } = data;

      const response = new Response(
        true,
        200,
        'Comment successfully liked',
        { posts, user, commentLikes, allLikes, commentReplyLikes }
      );
      return res.status(response.code).json(response);

    } catch(err){
      // console.log(err)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async flagPost(req, res){
    try {
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { postId } = req.body;

      const flagPost = await FlagPost.create({ postId, userId });

      if(!flagPost){
        const response = new Response(
          false,
          400,
          'Post could not flagged'
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Post successfully reported'
      );
      return res.status(response.code).json(response);

    } catch(err){
      console.log(err)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later'
      );
      return res.status(response.code).json(response);
    }
  }

  static async deletePost(req, res){
    try {
      const { postId } = req.body;
      const deletePost = await Post.destroy({ where: { id: postId } });

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
        'Server error, Please try again later'
      );
      return res.status(response.code).json(response);
    }
  }

  static async deleteComment(req,res){
    try{
      const { commentId } = req.body;

      const deleteComment = await Comment.destroy({ where: { id: commentId } })

      if(!deleteComment){
        const response = new Response(
          false,
          400,
          'Comment could not be deleted'
        );
        return res.status(response.code).json(response);
      }

      await CommentLike.destroy({ where: { commentId } })

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

  static async getFeedComments(req,res){
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

  static async getConnectedFeeds(req,res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const reponse = await getFeedContents(userId);
      
      const { posts, user, commentLikes, allLikes, commentReplyLikes } = reponse;
      const response = new Response(
        true,
        200,
        'Feeds succefully retrieved',
        { posts, user, commentLikes, allLikes, commentReplyLikes }
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

  static async sendCommentReply(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { commentId, comment } = req.body

      const postCommentReply = await CommentReply.create({
        userId, commentId, comment
      });

      if(!postCommentReply){
        const response = new Response(
          false,
          400,
          'Comment not saved',
        );
        return res.status(response.code).json(response);
      }

      const data = await getFeedContents(userId);
      const { posts, user, commentLikes, allLikes, commentReplyLikes } = data;

      const response = new Response(
        true,
        201,
        'Comment successfully created',
        { posts, user, commentLikes, allLikes, commentReplyLikes }
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

  static async deleteCommentReply(req,res){
    try{
      const { commentReplyId } = req.body;

      const deleteCommentReply = await CommentReply.destroy({ where: { id: commentReplyId } })

      if(!deleteCommentReply){
        const response = new Response(
          false,
          400,
          'Comment could not be deleted'
        );
        return res.status(response.code).json(response);
      }

      await CommentReplyLike.destroy({ where: { commentReplyId } })

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

  static async likeUserCommentReply(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { commentId, commentReplyId } = req.body;

      const data = await getFeedContents(userId);
      const { posts, user, commentLikes, allLikes, commentReplyLikes } = data;

      const isLike = await CommentReplyLike.findOne(
        {
          where: { userId, commentId, commentReplyId } 
        }
      );

      // Unlike Comment
      if(isLike){
        const unlikeComment = await CommentReplyLike.destroy({ where: { userId, commentId, commentReplyId } })

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
          { posts, user, commentLikes, allLikes, commentReplyLikes }
        );
        return res.status(response.code).json(response);
      }

      const likeComment = await CommentReplyLike.create({
        userId, commentId, commentReplyId
      });

      const response = new Response(
        true,
        200,
        'Comment successfully liked',
        { posts, user, commentLikes, allLikes, commentReplyLikes }
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

export default Communities;
