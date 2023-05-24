import dayjs from 'dayjs';
import activityRepository from '@/repositories/activity-repository';

async function findActivitiesService() {
  const allActivities = activityRepository.findActivities();
  return allActivities;
}

const serviceActivity = {
  findActivitiesService,
};

export default serviceActivity;
