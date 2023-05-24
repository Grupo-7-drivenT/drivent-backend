import { prisma } from '@/config';

async function findActivityId(id: number) {
  return prisma.activity.findFirst({
    where: { id },
  });
}
async function findActivitySectionalId(locationId: number) {
  return prisma.activity.findMany({
    where: { locationId },
  });
}
async function findActivities() {
  return prisma.activity.findMany();
}
async function findSectional() {
  return prisma.sectional.findMany();
}
async function findSectionalId(id: number) {
  return prisma.sectional.findFirst({
    where: {
      id,
    },
  });
}

const activityRepository = {
  findSectional,
  findSectionalId,
  findActivityId,
  findActivities,
  findActivitySectionalId,
};

export default activityRepository;
