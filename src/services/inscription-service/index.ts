import { prisma } from '@/config';

async function searchActivityId(activityId: number) {
  return prisma.matriculation.findMany({
    where: {
      activityId,
    },
  });
}

async function searchIncriptionUserId(userId: number) {
  return prisma.matriculation.findMany({
    where: {
      userId,
    },
  });
}
async function addInscription(userId: number, activityId: number) {
  return prisma.matriculation.create({
    data: {
      userId,
      activityId,
    },
  });
}
const inscriptionRepository = {
  addInscription,
  searchIncriptionUserId,
  searchActivityId,
};

export default inscriptionRepository;
