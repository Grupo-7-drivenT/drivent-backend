import { prisma } from '@/config';

async function findActivities() {
  return await prisma.activity.findMany({
    include: {
      Matriculation: true,
    },
  });
}

const activityRepository = {
  findActivities,
};

export default activityRepository;
