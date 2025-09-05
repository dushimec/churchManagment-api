import { PrismaClient, Role, MembershipStatus, ServiceType, EventType, ContributionType, PaymentMethod, RequestStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
  const password = await bcrypt.hash('Dushime12@', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'dushimec515@gmail.com',
      phone: '250789356233',
      password,
      firstName: 'dushime',
      lastName: 'christian',
      role: Role.ADMIN,
      isVerified: true,
      status: MembershipStatus.ACTIVE,
    },
  });
  const member = await prisma.user.create({
    data: {
      email: 'dushime515@gmail.com',
      phone: '250725047026',
      password,
      firstName: 'muhire',
      lastName: 'eric',
      role: Role.MEMBER,
      isVerified: true,
      status: MembershipStatus.BAPTIZED,
    },
  });
  await prisma.member.create({
    data: {
      userId: member.id,
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Male',
      maritalStatus: 'Single',
      nationality: 'Rwanda',
      occupation: 'Engineer',
      address: 'Kigali',
      ministryPreferences: ['choir'],
    },
  });
  const service = await prisma.service.create({
    data: {
      title: 'Sunday Worship',
      serviceType: ServiceType.SUNDAY_SERVICE,
      date: new Date(),
      location: 'Main Hall',
      startTime: new Date(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      preacherId: admin.id,
      attendanceCount: 1,
    },
  });

  // Seed Attendance
  await prisma.attendance.create({
    data: {
      serviceId: service.id,
      memberId: member.id,
      method: 'manual',
    },
  });

  // Seed Event
  const event = await prisma.event.create({
    data: {
      title: 'Church Conference',
      eventType: EventType.CONFERENCE,
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      location: 'Conference Hall',
      organizerId: admin.id,
      status: RequestStatus.APPROVED,
    },
  });

  // Seed Event Registration
  await prisma.eventRegistration.create({
    data: {
      eventId: event.id,
      memberId: member.id,
      status: RequestStatus.APPROVED,
    },
  });

  // Seed Contribution
  await prisma.contribution.create({
    data: {
      memberId: member.id,
      amount: 10000,
      contributionType: ContributionType.TITHE,
      paymentMethod: PaymentMethod.MOBILE_MONEY,
      transactionId: 'TXN123456',
      verified: true,
      verifiedById: admin.id,
    },
  });

  // Seed Notification
  await prisma.notification.create({
    data: {
      recipientId: member.id,
      title: 'Welcome!',
      message: 'Welcome to the Church Management System!',
      type: 'email',
    },
  });

  // Seed Message
  await prisma.message.create({
    data: {
      senderId: admin.id,
      receiverId: member.id,
      content: 'Hello, welcome to our church!',
    },
  });

  // Seed Prayer Request
  await prisma.prayerRequest.create({
    data: {
      memberId: member.id,
      request: 'Pray for my family.',
      isPrivate: false,
    },
  });

  // Seed Counseling Appointment
  await prisma.counselingAppointment.create({
    data: {
      memberId: member.id,
      pastorId: admin.id,
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      duration: 60,
      purpose: 'Spiritual Guidance',
      status: RequestStatus.PENDING,
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
