import { notFoundError } from '@/errors';
import serviceActivity from '@/services/activities-service';
import activityRepository from '@/repositories/activity-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { forBiddenError } from '@/errors/forbidden-error';

jest.mock('@/repositories/activity-repository');
jest.mock('@/repositories/enrollment-repository');
jest.mock('@/repositories/tickets-repository');

describe('findActivitiesService', () => {
  it('should return all activities', async () => {
    const activities = [
      { id: 1, name: 'Activity 1', capacity: 10 },
      { id: 2, name: 'Activity 2', capacity: 5 },
    ];

    activityRepository.findActivities.mockResolvedValue(activities);

    const result = await serviceActivity.findActivitiesService();

    expect(activityRepository.findActivities).toHaveBeenCalled();
    expect(result).toEqual(activities);
  });

  it('should throw notFoundError if no activities are found', async () => {
    activityRepository.findActivities.mockResolvedValue([]);

    await expect(serviceActivity.findActivitiesService()).rejects.toEqual(notFoundError());
    expect(activityRepository.findActivities).toHaveBeenCalled();
  });
});

describe('postMatriculationService', () => {
  it('should create a matriculation for the given user and activity', async () => {
    const userId = 1;
    const activityId = 1;
    const enrollment = { id: 1, userId, activityId };
    const ticket = { id: 1, status: 'PAID', TicketType: { isRemote: false } };

    enrollmentRepository.findWithAddressByUserId = jest.fn().mockResolvedValue(enrollment);
    ticketsRepository.findTicketByEnrollmentId = jest.fn().mockResolvedValue(ticket);

    await serviceActivity.postMatriculationService(userId, activityId);

    expect(enrollmentRepository.findWithAddressByUserId).toHaveBeenCalledWith(userId);
    expect(ticketsRepository.findTicketByEnrollmentId).toHaveBeenCalledWith(enrollment.id);
    expect(activityRepository.postMatriculation).toHaveBeenCalledWith(userId, activityId);
  });

  it('should throw notFoundError if no enrollment is found for the user', async () => {
    const userId = 1;
    const activityId = 1;

    enrollmentRepository.findWithAddressByUserId = jest.fn().mockResolvedValue(null);

    await expect(serviceActivity.postMatriculationService(userId, activityId)).rejects.toEqual(notFoundError());
    expect(enrollmentRepository.findWithAddressByUserId).toHaveBeenCalledWith(userId);
  });

  it('should throw notFoundError if no ticket is found for the enrollment', async () => {
    const userId = 1;
    const activityId = 1;
    const enrollment = { id: 1, userId, activityId };

    enrollmentRepository.findWithAddressByUserId = jest.fn().mockResolvedValue(enrollment);
    ticketsRepository.findTicketByEnrollmentId = jest.fn().mockResolvedValue(null);

    await expect(serviceActivity.postMatriculationService(userId, activityId)).rejects.toEqual(notFoundError());
    expect(enrollmentRepository.findWithAddressByUserId).toHaveBeenCalledWith(userId);
    expect(ticketsRepository.findTicketByEnrollmentId).toHaveBeenCalledWith(enrollment.id);
  });
  it('should throw forbiddenError if the ticket status is not "PAID"', async () => {
    const userId = 1;
    const activityId = 1;
    const enrollment = { id: 1, userId, activityId };
    const ticket = { id: 1, status: 'PENDING', TicketType: { isRemote: false } };

    enrollmentRepository.findWithAddressByUserId.mockResolvedValue(enrollment);
    ticketsRepository.findTicketByEnrollmentId.mockResolvedValue(ticket);

    await expect(serviceActivity.postMatriculationService(userId, activityId)).rejects.toEqual(forBiddenError());
    expect(enrollmentRepository.findWithAddressByUserId).toHaveBeenCalledWith(userId);
    expect(ticketsRepository.findTicketByEnrollmentId).toHaveBeenCalledWith(enrollment.id);
  });
});
