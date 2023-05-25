import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import serviceActivity from '@/services/activities-service';

async function showAllActivities(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const allActivities = await serviceActivity.findActivitiesService();
    return res.send(allActivities);
  } catch (error) {
    next(error);
  }
}

async function postMatriculation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;
  const activityId = req.body.activityId as number;

  try {
    await serviceActivity.postMatriculationService(userId, activityId);
    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    next(error);
  }
}

const activityControllers = {
  showAllActivities,
  postMatriculation,
};
export default activityControllers;
