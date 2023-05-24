import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import serviceActivity from '@/services/activities-service';

async function showAllActivities(req: AuthenticatedRequest, res: Response) {
  try {
    const allActivities = await serviceActivity.findActivitiesService();
    return res.send(allActivities);
  } catch (error) {
    return res.send(error);
  }
}

const activityControllers = {
  showAllActivities,
};
export default activityControllers;
