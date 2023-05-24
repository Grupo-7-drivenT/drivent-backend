import { prisma } from '@/config';

async function findActivities() {
  return prisma.activity.findMany();
}

async function findActivityId(id: number) {
  return prisma.activity.findFirst({
    where: { id },
  });
}
const activityRepository = {
  findActivityId,
  findActivities,
};

export default activityRepository;
