import { prisma } from '@/config';

export async function createActivityWithMatriculation(userId: number) {
  const activity = await prisma.activity.create({
    data: {
      name: 'Example Activity',
      capacity: 10,
      location: 'Example Location',
      startDateTime: new Date(),
      endDateTime: new Date(),
    },
  });

  await prisma.matriculation.create({
    data: {
      userId,
      activityId: activity.id,
    },
  });

  return activity;
}

export async function findMatriculationByUserIdAndActivityId(userId: number, activityId: number) {
  return await prisma.matriculation.findFirst({
    where: {
      userId,
      activityId,
    },
  });
}
