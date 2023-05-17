import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
const prisma = new PrismaClient();

async function main() {
  await prisma.event.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();

  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: 'Driven.t',
        logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
        backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, 'days').toDate(),
      },
    });
  }

  await prisma.ticketType.createMany({
    data: [
      {
        name: 'Remoto',
        price: 10000,
        isRemote: true,
        includesHotel: false,
      },
      {
        name: 'Presencial',
        price: 25000,
        isRemote: false,
        includesHotel: false,
      },
      {
        name: 'Presencial + Com hotel',
        price: 60000,
        isRemote: false,
        includesHotel: true,
      },
    ],
  });

  const hotel_1 = await prisma.hotel.create({
    data: {
      name: 'Driven Palace',
      image: 'https://dicasdacalifornia.com.br/wp-content/uploads/2019/03/caesars-palace-las-vegas.jpg',
    },
  });

  const hotel_2 = await prisma.hotel.create({
    data: {
      name: 'Driven tower',
      image:
        'https://hips.hearstapps.com/hmg-prod/images/city-skyline-at-night-with-bellagio-hotel-water-royalty-free-image-1670351062.jpg?crop=1.00xw:0.713xh;0,0.112xh&resize=1200:*',
    },
  });

  await prisma.room.createMany({
    data: [
      {
        name: 'Single',
        capacity: 1,
        hotelId: hotel_1.id,
      },
      {
        name: 'Double',
        capacity: 2,
        hotelId: hotel_1.id,
      },
      {
        name: 'Single',
        capacity: 1,
        hotelId: hotel_2.id,
      },
      {
        name: 'Double',
        capacity: 2,
        hotelId: hotel_2.id,
      },
      {
        name: 'Triple',
        capacity: 3,
        hotelId: hotel_2.id,
      },
    ],
  });

  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
