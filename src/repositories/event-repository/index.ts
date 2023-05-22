import { Event } from '@prisma/client';
import { redis, prisma } from '@/config';

async function findFirst(): Promise<Event | null> {
  const cachedEvent = await redis.get('firstEvent');
  if (cachedEvent) {
    return JSON.parse(cachedEvent) as Event;
  }

  const event = await prisma.event.findFirst();

  if (event) {
    await redis.set('firstEvent', JSON.stringify(event));
  }

  return event;
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
