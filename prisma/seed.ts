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

  let activity = await prisma.activity.findFirst();
  if (!activity) {
    await prisma.activity.createMany({
      data: [
        {
          name: 'Mastering TypeScript - 2023 Edition',
          capacity: 130,
          location: 'Sala de Workshop',
          startDateTime: new Date('2023-05-31T09:00-0300'),
          endDateTime: new Date('2023-05-31T10:00:00-0300'),
        },
        {
          name: 'React Native e Typescript: Criação de Apps Android e iOS',
          capacity: 70,
          location: 'Auditório Lateral',
          startDateTime: new Date('2023-05-29T10:00:00-0300'),
          endDateTime: new Date('2023-05-29T12:00:00-0300'),
        },
        {
          name: 'Design Patterns em TypeScript Entendendo Padrões de Projetos',
          capacity: 52,
          location: 'Sala de Workshop',
          startDateTime: new Date('2023-05-30T09:00-0300'),
          endDateTime: new Date('2023-05-30T12:00:00-0300'),
        },
        {
          name: 'Design Patterns em TypeScript Entendendo Padrões de Projetos',
          capacity: 31,
          location: 'Auditório Lateral',
          startDateTime: new Date('2023-05-31T09:00-0300'),
          endDateTime: new Date('2023-05-31T10:00:00-0300'),
        },
        {
          name: 'Certificação Amazon AWS Solutions Architect Associate 2023',
          capacity: 13,
          location: 'Auditório Principal',
          startDateTime: new Date('2023-05-29T14:00:00-0300'),
          endDateTime: new Date('2023-05-29T17:00:00-0300'),
        },
        {
          name: 'Arquitetura de Redes',
          capacity: 10,
          location: 'Auditório Principal',
          startDateTime: new Date('2023-05-30T09:00-0300'),
          endDateTime: new Date('2023-05-30T12:00:00-0300'),
        },
        {
          name: 'Guia Cisco CCNA para Iniciantes 2023',
          capacity: 5,
          location: 'Auditório Lateral',
          startDateTime: new Date('2023-05-30T09:00-0300'),
          endDateTime: new Date('2023-05-30T12:00:00-0300'),
        },
        {
          name: 'Linguagem R: do zero absoluto ao domínio em menos de 4 horas',
          capacity: 10,
          location: 'Auditório Principal',
          startDateTime: new Date('2023-05-31T09:00-0300'),
          endDateTime: new Date('2023-05-31T12:30:00-0300'),
        },
        {
          name: 'Redes Neurais Artificiais em Python',
          capacity: 3,
          location: 'Sala de Workshop',
          startDateTime: new Date('2023-05-29T09:00-0300'),
          endDateTime: new Date('2023-05-29T10:00:00-0300'),
        },
      ],
    });
  }

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
