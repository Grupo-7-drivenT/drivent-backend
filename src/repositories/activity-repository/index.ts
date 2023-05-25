import { prisma } from '@/config';

async function findActivities() {
  return await prisma.activity.findMany({
    include: {
      Matriculation: true,
    },
  });
}

async function postMatriculation(userId: number, activityId: number) {
  await prisma.matriculation.create({
    data: {
      userId,
      activityId,
    },
  });
}

const activityRepository = {
  findActivities,
  postMatriculation,
};

export default activityRepository;
