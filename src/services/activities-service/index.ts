import dayjs from 'dayjs';
import activityRepository from '@/repositories/activity-repository';
import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { forBiddenError } from '@/errors/forbidden-error';

async function findActivitiesService() {
  const allActivities = await activityRepository.findActivities();

  if (allActivities.length === 0) throw notFoundError();

  return allActivities;
}

async function postMatriculationService(userId: number, activityId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.TicketType.isRemote === true || ticket.status !== 'PAID') throw forBiddenError();

  await activityRepository.postMatriculation(userId, activityId);
}

const serviceActivity = {
  findActivitiesService,
  postMatriculationService,
};

export default serviceActivity;
