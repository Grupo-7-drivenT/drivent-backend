import dayjs from 'dayjs';
import activityRepository from '@/repositories/activity-repository';

async function findActivityIdService(activityId: number) {
  try {
    const activityById = activityRepository.findActivityId(+activityId);
    if (!activityById) {
      throw new Error('');
    }
    const location = activityRepository.findSectional();
    return activityById;
  } catch (error) {
    console.log(error);
  }
}
async function findActivitiesService() {
  const allActivities = activityRepository.findActivities();
  return allActivities;
}

const serviceActivity = {
  findActivitiesService,
};

export default serviceActivity;
