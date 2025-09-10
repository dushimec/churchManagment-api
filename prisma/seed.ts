import { PrismaClient, Role, MembershipStatus, ServiceType, EventType, ContributionType, PaymentMethod, RequestStatus, AssetCategory, AssetType, Language } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Dushime12@', 10);

  // ======================
  // 1. USERS (Admin + Member + Pastor)
  // ======================

  const admin = await prisma.user.upsert({
    where: { email: 'dushimec515@gmail.com' },
    update: {},
    create: {
      email: 'dushimec515@gmail.com',
      phone: '250789356233',
      password,
      firstName: 'Dushime',
      lastName: 'Christian',
      role: Role.ADMIN,
      isVerified: true,
      isEmailVerified: true,
      status: MembershipStatus.ACTIVE,
      language: Language.EN,
    },
  });

  const pastor = await prisma.user.upsert({
    where: { email: 'pastorjohn@example.com' },
    update: {},
    create: {
      email: 'pastorjohn@example.com',
      phone: '250780000001',
      password,
      firstName: 'John',
      lastName: 'Shepherd',
      role: Role.PASTOR,
      isVerified: true,
      isEmailVerified: true,
      status: MembershipStatus.ACTIVE,
      language: Language.EN,
    },
  });

  const member = await prisma.user.upsert({
    where: { email: 'dushime515@gmail.com' },
    update: {},
    create: {
      email: 'dushime515@gmail.com',
      phone: '250725047026',
      password,
      firstName: 'Muhire',
      lastName: 'Eric',
      role: Role.MEMBER,
      isVerified: true,
      isEmailVerified: true,
      status: MembershipStatus.BAPTIZED,
      language: Language.EN,
    },
  });

  // ======================
  // 2. MEMBERS (Profiles for users with role MEMBER or others if needed)
  // ======================

  const memberProfile = await prisma.member.upsert({
    where: { userId: member.id },
    update: {},
    create: {
      userId: member.id,
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Male',
      maritalStatus: 'Single',
      nationality: 'Rwanda',
      occupation: 'Software Engineer',
      address: 'Kigali, KG 5 Ave',
      baptismDate: new Date('2020-06-15'),
      confirmationDate: new Date('2021-03-22'),
      dateJoined: new Date('2019-08-10'),
      ministryPreferences: ['choir', 'ushering'],
    },
  });

  // Add family member
  await prisma.familyMember.upsert({
    where: { id: 'family-eric-child1' },
    update: {},
    create: {
      id: 'family-eric-child1',
      memberId: memberProfile.id,
      name: 'Lily Muhire',
      relationship: 'Child',
      dateOfBirth: new Date('2015-07-22'),
      isMember: false,
    },
  });

  // ======================
  // 3. ASSETS (Profile images, documents, etc.)
  // ======================

  // Admin profile image
  const adminAvatar = await prisma.asset.upsert({
    where: { userId: 'admin-avatar-001' },
    update: {},
    create: {
      url: 'https://example.com/avatars/admin.jpg',
      type: AssetType.IMAGE,
      category: AssetCategory.PROFILE_IMAGE,
      publicId: 'admin-avatar-001',
      userId: admin.id,
    },
  });

  // Member profile image
  const memberAvatar = await prisma.asset.upsert({
    where: { userId: 'member-avatar-001' },
    update: {},
    create: {
      url: 'https://example.com/avatars/member.jpg',
      type: AssetType.IMAGE,
      category: AssetCategory.PROFILE_IMAGE,
      publicId: 'member-avatar-001',
      userId: member.id,
    },
  });

  // Update users with avatar URLs
  await prisma.user.update({
    where: { id: admin.id },
    data: { avatarUrl: adminAvatar.url, profileImage: { connect: { id: adminAvatar.id } } },
  });

  await prisma.user.update({
    where: { id: member.id },
    data: { avatarUrl: memberAvatar.url, profileImage: { connect: { id: memberAvatar.id } } },
  });

  // Add a document asset (e.g., baptism certificate)
  await prisma.asset.create({
    data: {
      url: 'https://example.com/docs/baptism-certificate-eric.pdf',
      type: AssetType.DOCUMENT,
      category: AssetCategory.DOCUMENT, // ← You should add this to your enum!
      publicId: 'baptism-cert-eric',
      userId: member.id,
    },
  });

  // ======================
  // 4. SERVICES (Sunday Service, Bible Study, etc.)
  // ======================

  const sundayService = await prisma.service.upsert({
    where: { id: 'service-sunday-001' },
    update: {},
    create: {
      id: 'service-sunday-001',
      title: 'Sunday Morning Worship',
      serviceType: ServiceType.SUNDAY_SERVICE,
      date: new Date(),
      location: 'Main Sanctuary',
      preacherId: pastor.id,
      choirLeaderId: admin.id, // admin also leads choir
      startTime: new Date(new Date().setHours(9, 0, 0, 0)),
      endTime: new Date(new Date().setHours(11, 30, 0, 0)),
      attendanceCount: 2,
    },
  });

  const bibleStudy = await prisma.service.create({
    data: {
      title: 'Wednesday Bible Study',
      serviceType: ServiceType.BIBLE_STUDY,
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
      location: 'Fellowship Hall',
      preacherId: pastor.id,
      startTime: new Date(new Date().setHours(18, 0, 0, 0)),
      endTime: new Date(new Date().setHours(19, 30, 0, 0)),
      attendanceCount: 0,
    },
  });

  // ======================
  // 5. ATTENDANCE (Link to Member via Member.id, not User.id — if you changed schema)
  // ⚠️ If you kept Attendance → User, use member.id. If you updated to → Member, use memberProfile.id
  // Here we assume you kept → User (for backward compatibility with your current seed)
  // ======================

  await prisma.attendance.upsert({
    where: {
      serviceId_memberId: {
        serviceId: sundayService.id,
        memberId: member.id, // ← if schema changed to Member, use memberProfile.id
      },
    },
    update: {},
    create: {
      serviceId: sundayService.id,
      memberId: member.id, // ← same as above
      method: 'qr_code',
    },
  });

  await prisma.attendance.create({
    data: {
      serviceId: sundayService.id,
      memberId: admin.id,
      method: 'manual',
    },
  });

  // ======================
  // 6. SERMONS
  // ======================

  const sermon1 = await prisma.sermon.upsert({
    where: { id: 'sermon-001' },
    update: {},
    create: {
      id: 'sermon-001',
      title: 'The Power of Faith',
      preacherId: pastor.id,
      serviceId: sundayService.id,
      theme: 'Faith and Works',
      scripture: 'James 2:14-26',
      audioUrl: 'https://example.com/sermons/faith.mp3',
      videoUrl: 'https://example.com/sermons/faith.mp4',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      tags: 'faith,works,james',
    },
  });

  // Second sermon (same service, different preacher — allowed after removing @unique)
  await prisma.sermon.create({
    data: {
      title: 'Children\'s Message: Trusting God',
      preacherId: admin.id,
      serviceId: sundayService.id,
      theme: 'Trusting God',
      scripture: 'Proverbs 3:5-6',
      videoUrl: 'https://example.com/sermons/kids-trust.mp4',
    },
  });

  // ======================
  // 7. EVENTS
  // ======================

  const conferenceEvent = await prisma.event.upsert({
    where: { id: 'event-conf-001' },
    update: {},
    create: {
      id: 'event-conf-001',
      title: 'Annual Church Conference',
      eventType: EventType.CONFERENCE,
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // in 7 days
      endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 2-day event
      location: 'Kigali Conference Center',
      organizerId: admin.id,
      status: RequestStatus.APPROVED,
    },
  });

  const baptismEvent = await prisma.event.create({
    data: {
      title: 'Baptism Service - June',
      eventType: EventType.BAPTISM,
      startDate: new Date('2025-06-15T10:00:00Z'),
      endDate: new Date('2025-06-15T12:00:00Z'),
      location: 'Church Baptistry',
      organizerId: pastor.id,
      status: RequestStatus.APPROVED,
    },
  });

  // ======================
  // 8. EVENT REGISTRATIONS
  // ======================

  await prisma.eventRegistration.upsert({
    where: {
      eventId_memberId: {
        eventId: conferenceEvent.id,
        memberId: member.id,
      },
    },
    update: {},
    create: {
      eventId: conferenceEvent.id,
      memberId: member.id,
      status: RequestStatus.APPROVED,
    },
  });

  // ======================
  // 9. CONTRIBUTIONS
  // ======================

  await prisma.contribution.upsert({
    where: { transactionId: 'TXN123456' },
    update: {},
    create: {
      memberId: member.id,
      amount: 10000,
      contributionType: ContributionType.TITHE,
      paymentMethod: PaymentMethod.MOBILE_MONEY,
      transactionId: 'TXN123456',
      verified: true,
      verifiedById: admin.id,
      date: new Date(),
    },
  });

  await prisma.contribution.create({
    data: {
      memberId: member.id,
      amount: 5000,
      contributionType: ContributionType.OFFERING,
      paymentMethod: PaymentMethod.CASH,
      transactionId: 'TXN-OFFERING-789',
      verified: false,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  });

  // ======================
  // 10. MEDIA (Sermon & Event media)
  // ======================

  await prisma.media.create({
    data: {
      title: 'Sermon Audio - The Power of Faith',
      description: 'Full audio recording',
      url: sermon1.audioUrl!,
      fileType: 'audio',
      uploadedById: admin.id,
      sermonId: sermon1.id,
    },
  });

  await prisma.media.create({
    data: {
      title: 'Conference Group Photo',
      description: 'Group photo from Annual Conference',
      url: 'https://example.com/photos/conference-group.jpg',
      fileType: 'image',
      uploadedById: admin.id,
      eventId: conferenceEvent.id,
    },
  });

  // ======================
  // 11. NOTIFICATIONS
  // ======================

  await prisma.notification.createMany({
    data: [
      {
        recipientId: member.id,
        title: 'Welcome!',
        message: 'Welcome to the Church Management System!',
        type: 'email',
        read: false,
      },
      {
        recipientId: member.id,
        title: 'Event Reminder',
        message: 'Don’t forget the Annual Conference next week!',
        type: 'push',
        read: false,
        relatedEventId: conferenceEvent.id,
      },
    ],
    skipDuplicates: true,
  });

  // ======================
  // 12. MESSAGES
  // ======================

  await prisma.message.createMany({
    data: [
      {
        senderId: admin.id,
        receiverId: member.id,
        content: 'Hello Eric, welcome to our church family!',
        read: false,
      },
      {
        senderId: pastor.id,
        receiverId: member.id,
        content: 'Looking forward to seeing you at Bible Study this Wednesday.',
        read: true,
      },
    ],
    skipDuplicates: true,
  });

  // ======================
  // 13. PRAYER REQUESTS
  // ======================

  await prisma.prayerRequest.createMany({
    data: [
      {
        memberId: member.id,
        request: 'Pray for my family’s health and provision.',
        isPrivate: false,
        responded: false,
      },
      {
        memberId: member.id,
        request: 'Pray for wisdom in my career decisions.',
        isPrivate: true,
        responded: true,
        response: 'I prayed for you this morning. God will guide you.',
        pastorId: pastor.id,
        respondedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  // ======================
  // 14. COUNSELING APPOINTMENTS
  // ======================

  await prisma.counselingAppointment.createMany({
    data: [
      {
        memberId: member.id,
        pastorId: pastor.id,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // in 3 days
        duration: 60,
        purpose: 'Spiritual Guidance',
        status: RequestStatus.PENDING,
      },
      {
        memberId: member.id,
        pastorId: pastor.id,
        date: new Date('2025-06-01T14:00:00Z'),
        duration: 45,
        purpose: 'Marriage Counseling',
        status: RequestStatus.APPROVED,
        notes: 'Couple seeking pre-marital guidance.',
      },
    ],
    skipDuplicates: true,
  });

  // ======================
  // 15. MARRIAGE & BAPTISM REQUESTS
  // ======================

  const marriageReq = await prisma.marriageRequest.create({
    data: {
      brideName: 'Jane Doe',
      groomName: 'John Smith',
      bridePhone: '250788888888',
      groomPhone: '250789999999',
      weddingDate: new Date('2025-12-20'),
      location: 'Church Main Hall',
      witness1Name: 'Alice Brown',
      witness1Phone: '250787777777',
      witness2Name: 'Bob Green',
      witness2Phone: '250786666666',
      documentsSubmitted: ['ID', 'Baptism Certificate'],
      requesterId: member.id,
      status: RequestStatus.PENDING,
    },
  });

  const baptismReq = await prisma.baptismRequest.create({
    data: {
      childName: 'Baby Muhire',
      dateOfBirth: new Date('2024-10-01'),
      parent1Name: 'Muhire Eric',
      parent1Phone: '250725047026',
      parent1Email: 'dushime515@gmail.com',
      parent2Name: 'Uwase Marie',
      parent2Phone: '250725047027',
      requesterId: member.id,
      status: RequestStatus.APPROVED,
      approvedById: pastor.id,
      approvedAt: new Date(),
      scheduledDate: new Date('2025-06-15'),
      certificateUrl: 'https://example.com/certs/baby-muhire.pdf',
      eventId: baptismEvent.id,
    },
  });

  console.log('✅ Seed data created/updated successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });