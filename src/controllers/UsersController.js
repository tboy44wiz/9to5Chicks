import Sequelize from 'sequelize';
import db from '../database/models';
import Response from '../helpers/Response';
import jwtHelper from '../helpers/Token';
import EmailNotifications from '../helpers/EmailNotifications';
import search from './Helper';

const Op = Sequelize.Op;
const { getUserDetails } = search;

const { User, Country, WorkHistory, EducationHistory, Group, GroupMember } = db;

class UsersController {
  static async getOnBoadingStatus(req, res){
    try {
      const { payload } = req.payload;
      const { email } = payload;
  
      const user = await User.findOne({ where: { email } });
      const { onBoardingStep } = user;
  
      let onBoardingStatus, url;
      
      if(parseInt(onBoardingStep) === 2){
        url = '/onboarding_three';
        onBoardingStatus = false;
      } else if(parseInt(onBoardingStep) === 3){
        url = null;
        onBoardingStatus = true;
      } else{
        url = null;
        onBoardingStatus = true
      }
  
      const response = new Response(
        true,
        200,
        'On-Boarding Status retrieved successfully',
        { url, onBoardingStatus }
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

  static async onBoardingOne(req,res){
    try{
      const { payload } = req.payload;
      const { email } = payload;
      const {
        country, city, dob, language, jobTitle, jobSector, hobbies, onBoardingStep } = req.body;

        const newHobbies = hobbies.join(',');

      const user = await User.update(
          { country, city, dob, language, jobTitle, jobSector, hobbies: newHobbies, onBoardingStep },
          { 
            where: { email },
            returning: true,
            plain: true
          }
        );

      if(!user){
        const response = new Response(
          false,
          400,
          'Error!, could not save user details'
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'User details saved successfully',
      )
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

  static async onBoardingTwo(req,res){
    try{
      const { payload } = req.payload;
      const { email } = payload;
      const {
        iCanAccess, iCanOffer, onBoardingStep } = req.body;

        const newICanAccess = iCanAccess.join(',');
        const newICanOffer = iCanOffer.join(',');
        console.log(newICanAccess, newICanOffer);

      const user = await User.update(
          { 
            iCanOffer: newICanAccess,
            iCanAccess: newICanOffer,
            onBoardingStep 
          },
          { 
            where: { email },
            returning: true,
            plain: true
          }
        );

      if(!user){
        const response = new Response(
          false,
          400,
          'Error!, could not save user details'
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'User details saved successfully',
      )
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
  
  static async inviteFriends(req, res){
    try {
      const { payload } = req.payload;
      const { email } = payload;
      const { anonymous, friends } = req.body;

      const user = await User.findOne({ where: { email } });
      const { firstName, lastName } = user;

      // const successfulSend = friends.map(friend => (
      //   EmailNotifications.inviteFriends(friend.email, firstName, lastName, anonymous)
      // ))
      //let recipent;
      for(let i = 0; i < friends.length; i++){
        EmailNotifications.inviteFriends(friends[i].email, firstName, lastName, anonymous)
        // recipent = friends[i].email;
      }

      // console.log(recipent)
      // await EmailNotifications.inviteFriends('tjhakeemus@gmail.com', firstName, lastName, anonymous);
      // await EmailNotifications.signupEmail('tjhakeemus@gmail.com', 'http://google.com', 'femi')

      // await User.update(
      //   { onBoardingStep: 3},
      //   { where: { email }}
      // );

      const response = new Response(
        true,
        200,
        'Invites sent successfully'
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

  static async onBoardingThree(req, res) {
    try {
      const { payload } = req.payload;
      const { email } = payload;
      const { interests } = req.body;
      const newInterests = interests.join(',');

      const saveInterests = await User.update(
        { interests: newInterests, onBoardingStep: 3 },
        { where: { email } },
      );

      if(!saveInterests){
        const response = new Response(
          false,
          400,
          'Error, Interests could save interests'
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'User interests saved successfully',
      );
      return res.status(response.code).json(response);

    } catch (err){
      console.log(err)
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }
  static async createWorkHistory(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { title, company, workStatus, startDate, endDate } = req.body;

      const work = await WorkHistory.create({
        title, company, workStatus, startDate, endDate, userId
      })

      if(!work){
        const response = new Response(
          false,
          400,
          'Error Saving, Try again!!',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        201,
        'Saved Successfully',
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
  static async editWorkHistory(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { workId } = req.params;
      const { title, company, workStatus, startDate, endDate } = req.body;
      console.log(workStatus)

      const work = await WorkHistory.update(
        { title, company, workStatus, startDate, endDate },
        { where: { userId, id: workId },
          returning: true,
          plain: true
        },
      );

      if(!work){
        const response = new Response(
          false,
          400,
          'Error Updating, Try again!!',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Saved Successfully',
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
  static async getWorkHistory(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { workId } = req.params;

      const work = await WorkHistory.findOne({ where: { userId, id: workId } });

      if(!work){
        const response = new Response(
          false,
          400,
          'Error! No work experience found',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved',
        { work }
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
  static async deleteWorkHistory(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { workId } = req.params;

      const work = await WorkHistory.destroy({ where: { userId, id: workId } });

      if(!work){
        const response = new Response(
          false,
          400,
          'Error Deleting, Try again!!',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully deleted',
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

  static async updateProfileAvatar(req, res){
    try{ 
      const { payload } = req.payload;
      const { email } = payload;

      const user = await User.scope('withoutPassword').update(
        {
          avatar: `http://${req.headers.host}/uploads/${req.file.filename}` || null,
        },
        { where: { email } }
      );

      if(!user){
        const response = new Response(
          false,
          400,
          'Error, try again!'
        );
        return res.status(response.code).json(response);
      };

      const data = await getUserDetails(email)
      const { userDetails } = data;

      const token = jwtHelper.generateToken({
        id: userDetails.id,
        email,
        role: userDetails.role,
        status: userDetails.status,
        userDetails
      });

      const response = new Response(
        true,
        200,
        'Avatar successfully updated',
        {userDetails, token }
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

  static async updateCoverImage(req, res){
    try{ 
      const { payload } = req.payload;
      const { email } = payload;

      const user = await User.scope('withoutPassword').update(
        {
          coverImage: `http://${req.headers.host}/uploads/${req.file.filename}` || null,
        },
        { where: { email } }
      );

      if(!user){
        const response = new Response(
          false,
          400,
          'Error, try again!'
        );
        return res.status(response.code).json(response);
      };

      const data = await getUserDetails(email)
      const { userDetails } = data;

      const token = jwtHelper.generateToken({
        id: userDetails.id,
        email,
        role: userDetails.role,
        status: userDetails.status,
        userDetails
      });

      const response = new Response(
        true,
        200,
        'Avatar successfully updated',
        {userDetails, token }
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

  static async createEduHistory(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { school, degree, fos, startDate, endDate } = req.body;

      const eduHistory = await EducationHistory.create({
        school, degree, fos, startDate, endDate, userId
      })

      if(!eduHistory){
        const response = new Response(
          false,
          400,
          'Error Saving, Try again!!',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        201,
        'Saved Successfully',
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
  static async updateEduHistory(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { school, degree, fos, startDate, endDate } = req.body;
      const { eduId } = req.params;

      const eduHistory = await EducationHistory.update(
        {
          school, degree, fos, startDate, endDate, userId
        },
        { 
          where: { userId, id: eduId },
          returning: true,
          plain: true
        }
      )

      if(!eduHistory){
        const response = new Response(
          false,
          400,
          'Error Saving, Try again!!',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Updated Successfully',
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
  static async getEduHistory(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { eduId } = req.params;

      const education = await EducationHistory.findOne({ 
          where: { id: eduId },
      });

      if(!education){
        const response = new Response(
          false,
          400,
          'Error Retrieving, Try again!!',
        );
        return res.status(response.code).json(response);
      }

      if(education.userId !== userId){
        const response = new Response(
          false,
          400,
          'Error retrieving, Doesn"t belong to you ',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Successfully retrieved',
        { education }
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

  static async getAllEduHistory(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;

      const eduHistories = await EducationHistory.findAll({ 
          where: { userId },
      });

      if(!eduHistories){
        const response = new Response(
          false,
          400,
          'Error Saving, Try again!!',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Retrieved Successfully',
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
  static async deleteEduHistory(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { eduId } = req.params;

      const eduHistory = await EducationHistory.destroy({ 
          where: { userId, id: eduId },
      });

      if(!eduHistory){
        const response = new Response(
          false,
          400,
          'Error Saving, Try again!!',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Deleted Successfully',
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

  static async viewOtherProfile(req, res){
    try{
      // const { payload } = req.payload;
      // const { id: userId } = payload;
      const { id } = req.params;

      const user = await User.scope('withoutPassword').findOne({ 
          where: { id },
      });

      const workHistory = await WorkHistory.findAll({ where: { userId: id } });

      const eduHistory = await EducationHistory.findAll({ where: { userId: id } });

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

      if(!user){
        const response = new Response(
          false,
          400,
          'Error Retrieving, Try again!!',
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Retrieved Successfully',
        { user, workHistory, eduHistory, groups }
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

export default UsersController;
