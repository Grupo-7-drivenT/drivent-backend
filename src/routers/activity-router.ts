import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import activityControllers from '@/controllers/activity-controller';

const activitiesRouter = Router();

activitiesRouter
  .all('/*', authenticateToken)
  .get('/', activityControllers.showAllActivities)
  .post('/', activityControllers.postMatriculation);

export { activitiesRouter };
