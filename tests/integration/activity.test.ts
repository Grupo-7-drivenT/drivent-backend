import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicket,
  createPayment,
  createTicketTypeWithHotel,
  createActivityWithMatriculation,
  findMatriculationByUserIdAndActivityId,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /activity', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/activity');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/activity').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/activity').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user has not matriculated to any activity', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/activity').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and activities data when user has matriculated activities', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      await createActivityWithMatriculation(user.id);

      const response = await server.get('/activity').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            capacity: expect.any(Number),
            endDateTime: expect.any(String),
            id: expect.any(Number),
            location: expect.any(String),
            name: expect.any(String),
            startDateTime: expect.any(String),
          }),
        ]),
      );
    });
  });
});

describe('POST /activity', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/activity');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/activity').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/activity').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if user has no enrollment', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.post('/activity').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 200 and create matriculation if user has paid ticket', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);
    const activity = await createActivityWithMatriculation(user.id);

    const response = await server
      .post('/activity')
      .set('Authorization', `Bearer ${token}`)
      .send({ activityId: activity.id });

    expect(response.status).toBe(httpStatus.CREATED);

    const matriculation = await findMatriculationByUserIdAndActivityId(user.id, activity.id);
    expect(matriculation).toBeDefined();
    expect(matriculation.userId).toBe(user.id);
    expect(matriculation.activityId).toBe(activity.id);
  });
});
