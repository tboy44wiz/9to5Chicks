import Sequelize from 'sequelize'
import db from '../database/models';
import Response from '../helpers/Response';

const Op = Sequelize.Op;
const { User, Mentorship, Friend, MenteeApplication } = db;

class MentorshipController {
  static async createMentee(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;

      const checkExist = await Mentorship.findOne({ where: { menteeId: userId }});
      if(checkExist){
        const response = new Response(
          false,
          401,
          'User already has an application',
        );
        return res.status(response.code).json(response);
      };

      const {
        question1,
        question2,
        question3
       } = req.body;

       // saves mentee application form
       await MenteeApplication.create({
         question1, question2, question3, userId
       });

      // add to mentorship table
      const mentor = await Mentorship.create({
        menteeId: userId, status: 'pending'
      });

      if(!mentor){
        const response = new Response(
          false,
          400,
          'Opps!, try again!',
        );
        return res.status(response.code).json(response);
      }
      
      const response = new Response(
        true,
        201,
        'Application successfully created',
      );
      return res.status(response.code).json(response);

    }catch(error){
      console.log(error);
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async assignMentor(req,res){
    try{
      const { menteeId, mentorId } = req.body;
      const mentor = await Mentorship.update(
        { mentorId, status: 'assigned' },
        { 
          where: { menteeId },
          returning: true,
          plain: true
        }
      );

      if(!mentor){
        const response = new Response(
          false,
          400,
          'Something went wrong'
        );
        return res.status(response.code).json(response)
      }

      await User.update(
        { isMentor: true },
        {
          where: { id: mentorId },
          returning: true,
          plain: true
        }
      )

      const response = new Response(
        true,
        201,
        'Assigned Mentor successfully',
        { mentor }
      );
      return res.status(response.code).json(response)

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

  static async sendMentorshipInvite(req,res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;

      const { status, menteeId } = req.body;

      const mentor = await Mentorship.update(
        { mentorStatus: status },
        { 
          where: { menteeId, mentorId: userId },
          returning: true,
          plain: true
        }
      );

      if(!mentor){
        const response = new Response(
          false,
          400,
          'Something went wrong'
        );
        return res.status(response.code).json(response)
      }

      if(status === 'accepted'){
        // add to user table, isMentee - true
        await User.update(
          { isMentee: true },
          { 
            where: { id: menteeId },
            returning: true,
            plain: true
          }
        );
      }

      const response = new Response(
        true,
        200,
        `${status} mentorship request from admin successfully`,
        { mentor }
      );
      return res.status(response.code).json(response)

      // sends invite to connect to mentee
      // const isFriend = await Friend.findOne({
      //   where: { userId: menteeId, friendId: mentorId }
      // });
      // const isFriendOf = await Friend.findOne({
      //   where: { userId: mentorId, friendId: menteeId }
      // });
      // if(isFriend || isFriendOf){
      //   const response = new Response(
      //     false,
      //     400,
      //     'Users already have an existing network with each other',
      //   );
      //   return res.status(response.code).json(response)
      // }

      // await Friend.create({
      //   userId: mentorId, friendId: menteeId, invites: 'sent'
      // });

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

  static async acceptMentor(req,res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;

      const { mentorId, status } = req.body;

      const isAccept = await Mentorship.update(
        { menteeStatus: status },
        {
          where: { menteeId: userId, mentorId },
          returning: true,
          plain: true
        }
      );

      if(!isAccept){
        const response = new Response(
          false,
          400,
          'Opps!, Try again..',
        );
        return res.status(response.code).json(response);        
      };

      const response = new Response(
        true,
        200,
        `${status} request successfully`,
      );
      return res.status(response.code).json(response);  

      // if(status === 'rejected'){
      //   await Friend.destroy({ where: { friendId: userId, userId: mentorId } });

      //   const response = new Response(
      //     true,
      //     200,
      //     'Friend Request Rejected Successfully',
      //   );
      //   return res.status(response.code).json(response);
      // } else if(status === 'accepted'){
      //   const user = await Friend.update(
      //     { status },
      //     {
      //       where: { friendId: userId, userId: mentorId },
      //     }
      //   );

      //   await Friend.create(
      //     { userId, friendId: mentorId, status: 'accepted', invites: 'accepted' }
      //   );

      //   await User.update(
      //     { isMentor: true },
      //     {
      //       where: { id: mentorId },
      //       returning: true,
      //       plain: true
      //     }
      //   )
      // }
      
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

  static async getMentorshipApplication(req, res){
    try{
      const applications = await Mentorship.findAll(
        {
          include: [
            { 
              model: User, as: 'mentee',
              include: [{ model: MenteeApplication, as: 'menteeApplication' }] 
            }
          ]
        }
      );

      if(!applications.length){
        const response = new Response(
          false,
          400,
          'No application found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Mentorship applications retrieved successfully',
        { applications }
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

  static async getMentorshipSuggestion(req, res){
    try{
      const { id } = req.params;
      
      const meUser = await User.findOne({ where: { id } });

      const users = await User.findAll(
        { 
          where: {
            // jobTitle: meUser.jobTitle,
            chickType: 'titan',
            [Op.or]: [ 
              { jobTitle: { [Op.iLike]: '%' + meUser.jobTitle + '%'} }, 
              { hobbies: { [Op.iLike]: `%${meUser.hobbies}%` } }, 
              { interests: {[Op.iLike]: `%${meUser.interests}%` } }
            ]  
          }
        }
      );


      const removeMentee = users.filter(data => data.id !== parseInt(id));

      if(!users.length){
        const response = new Response(
          false,
          400,
          'No users found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Mentorship suggestions retrieved successfully',
        { users: removeMentee }
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

export default MentorshipController;
