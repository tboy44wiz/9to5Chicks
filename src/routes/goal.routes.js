import { Router } from 'express';
import GoalController from '../controllers/GoalController';
import TokenHelper from '../helpers/Token';

const goalRoute = Router();

goalRoute.post(
  '/create_goal',
  TokenHelper.verifyToken,
  GoalController.createGoal
);

goalRoute.get(
  '/get_goals',
  TokenHelper.verifyToken,
  GoalController.getAllGoals
);

goalRoute.get(
  '/get_mentee_goals/:userId',
  TokenHelper.verifyToken,
  GoalController.getAllMenteeGoals
);

goalRoute.get(
  '/get_goals_rating',
  TokenHelper.verifyToken,
  GoalController.goalRating
);

goalRoute.get(
  '/get_mentee_goals_rating/:id',
  TokenHelper.verifyToken,
  GoalController.menteeGoalRating
);

goalRoute.get(
  '/get_goal/:goalId',
  TokenHelper.verifyToken,
  GoalController.getAGoal
);

goalRoute.patch(
  '/update_goal/:goalId',
  TokenHelper.verifyToken,
  GoalController.editGoal
);

goalRoute.post(
  '/add_goal_action',
  TokenHelper.verifyToken,
  GoalController.addGoalAction
);

goalRoute.post(
  '/delete_goal',
  TokenHelper.verifyToken,
  GoalController.deleteGoal
);

goalRoute.delete(
  '/delete_goal_action/:goalActionId',
  TokenHelper.verifyToken,
  GoalController.deleteGoalAction
);

export default goalRoute;
