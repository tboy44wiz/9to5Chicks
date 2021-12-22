import db from '../database/models';
import Response from '../helpers/Response';
import search from './Helper';

const { User, Goal, GoalAction } = db;

class GoalController {
  static async createGoal(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { goalTitle, goalDescription, actions, startDate, endDate } = req.body;
      const newActions = actions.join(',');

      const goal = await Goal.create({
        userId, goalTitle, goalDescription, actions: newActions, startDate, endDate
      });

      if(!goal){
        const response = new Response(
          false,
          401,
          'Error, creating goal'
        );
        return res.status(response.code).json(response);
      }

      for(let i = 0; i < actions.length; i++){
        await GoalAction.create({
          userId, goalDescription: actions[i], goalId: goal.id, status: false    
        })
      }

      const response = new Response(
        true,
        201,
        'Goal created successfully',
        { goal },
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

  static async getAllGoals(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      
      const goals = await Goal.findAll(
        { 
          where: { userId },
          include: [
            { model: GoalAction, as: 'goalAction' }
          ] 
        }
      );
      if(!goals.length){
        const response = new Response(
          false,
          404,
          'No goals found'
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Goals retrieved successfully',
        { goals }
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

  static async getAllMenteeGoals(req, res){
    try{
      const { userId } = req.params;
      
      const goals = await Goal.findAll(
        { 
          where: { userId },
          include: [
            { model: GoalAction, as: 'goalAction' }
          ] 
        }
      );
      if(!goals.length){
        const response = new Response(
          false,
          404,
          'No goals found'
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Goals retrieved successfully',
        { goals }
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

  static async getAGoal(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { goalId } = req.params;
      
      const goal = await Goal.findOne({ 
        where: { id: goalId },
        include: [
          { model: GoalAction, as: 'goalAction' }
        ] 
      });
      if(!goal){
        const response = new Response(
          false,
          404,
          'No goal found'
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Goal retrieved successfully',
        { goal }
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

  static async editGoal(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { goalTitle, goalDescription, actions, startDate, endDate, goalActions } = req.body;
      const { goalId } = req.params;
      // console.log('>>', goalActions);

      const newActions = actions.join(',');
      
      const goal = await Goal.update( 
        { goalTitle, goalDescription, actions: newActions, startDate, endDate },
        { where: { id: goalId, userId },
          returning: true,
          plain: true
        }
      );

      if(!goal){
        const response = new Response(
          false,
          400,
          'Error! Something went wrong'
        );
        return res.status(response.code).json(response);
      }

      for(let i = 0; i < goalActions.length; i++){
        // console.log(goalActions[i].status)
        if(goalActions[i].status === true){
          await GoalAction.update(
            { 
              status: goalActions[i].status 
            },
            { where: { goalId, userId, id: goalActions[i].id } }
          )
        } 
        // else {
        //   await GoalAction.update(
        //     { 
        //       status: goalActions[i].status 
        //     },
        //     { where: { goalId, userId } }
        //   )
        // }
      }

      const response = new Response(
        true,
        200,
        'Goal updated successfully',
        { goal }
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

  static async addGoalAction(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { goalDescription, status, goalId } = req.body;
      
      const goal = await GoalAction.create( 
        { goalDescription, goalId, userId, status }
      );

      if(!goal){
        const response = new Response(
          false,
          400,
          'Error! Something went wrong'
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        201,
        'Goal Action created successfully',
        { goal }
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

  static async deleteGoal(req, res){
      try{
        const { payload } = req.payload;
        const { id: userId } = payload;
        const { goalId } = req.params;
        
        const goal = await Goal.destroy({ where: { id: goalId, userId } });
  
        if(!goal){
          const response = new Response(
            false,
            400,
            'Error! Something went wrong'
          );
          return res.status(response.code).json(response);
        }
  
        const response = new Response(
          true,
          200,
          'Goal deleted successfully',
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

  static async deleteGoalAction(req, res){
    try{
      const { payload } = req.payload;
      const { id: userId } = payload;
      const { goalActionId } = req.params;
      
      const goal = await GoalAction.destroy({ where: { id: goalActionId, userId } });

      if(!goal){
        const response = new Response(
          false,
          400,
          'Error! Something went wrong'
        );
        return res.status(response.code).json(response);
      }

      const response = new Response(
        true,
        200,
        'Goal deleted successfully',
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

  static async goalRating(req, res){
    try {
      const { payload } = req.payload;
      const { id: userId } = payload;

      const actions = await GoalAction.findAll({
        where: { userId }
      });

      const achievedGoal = actions.filter(data => data.status != false);
      const achievedPercentage = (achievedGoal.length / actions.length) * 100;
      const rate = isNaN(achievedPercentage) ? 0 : achievedPercentage;

      const goalIds = actions.map(data => data.goalId);

      // const actions = await GoalAction.findAll({
      //   where: { userId, goalId: goalIds }
      // });
      let count;
      for(let i = 0; i < goalIds.length; i++){
        count = 0;
        const actionsStatus = await GoalAction.findAll({
          where: { userId, goalId: goalIds[i] }
        });
        const achieved = actionsStatus.filter(data => data.status != false);
        const achievedPercentage = (achieved.length / actionsStatus.length) * 100;
        console.log(achievedPercentage)
        const rate = (achievedPercentage !== 100) ? NaN : 1
        const rating = isNaN(rate) ? 0 : count++;
      }



      const response = new Response(
        true,
        200,
        'Successful',
        { rate, goalSmashed: achievedGoal.length, count }
      );
      return res.status(response.code).json(response);

    }catch(error){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }

  static async menteeGoalRating(req, res){
    try {
      const { id } = req.params;

      const goal = await Goal.findAll(
        { where: { userId: id } }
      )

      const actions = await GoalAction.findAll({
        where: { userId: id }
      });

      const achievedGoal = actions.filter(data => data.status != false);
      const achievedPercentage = (achievedGoal.length / actions.length) * 100;
      const rate = isNaN(achievedPercentage) ? 0 : achievedPercentage;

      const goalIds = actions.map(data => data.goalId);

      // const actions = await GoalAction.findAll({
      //   where: { userId, goalId: goalIds }
      // });
      let count;
      for(let i = 0; i < goalIds.length; i++){
        count = 0;
        const actionsStatus = await GoalAction.findAll({
          where: { userId: id, goalId: goalIds[i] }
        });
        const achieved = actionsStatus.filter(data => data.status != false);
        const achievedPercentage = (achieved.length / actionsStatus.length) * 100;
        console.log(achievedPercentage)
        const rate = (achievedPercentage !== 100) ? NaN : 1
        const rating = isNaN(rate) ? 0 : count++;
      }



      const response = new Response(
        true,
        200,
        'Successful',
        { rate, goalSmashed: achievedGoal.length, count, goal }
      );
      return res.status(response.code).json(response);

    }catch(error){
      const response = new Response(
        false,
        500,
        'Server error, Please try again later',
      );
      return res.status(response.code).json(response);
    }
  }
}

export default GoalController;
