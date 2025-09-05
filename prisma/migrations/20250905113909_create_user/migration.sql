-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('MEMBER', 'PASTOR', 'ADMIN', 'CHOIR_LEADER', 'TREASURER');

-- CreateEnum
CREATE TYPE "public"."Language" AS ENUM ('EN', 'FR');

-- CreateEnum
CREATE TYPE "public"."MembershipStatus" AS ENUM ('NEW', 'BAPTIZED', 'CONFIRMED', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."ServiceType" AS ENUM ('SUNDAY_SERVICE', 'BIBLE_STUDY', 'CHOIR_PRACTICE', 'PRAYER_MEETING', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('WEDDING', 'BAPTISM', 'CONFERENCE', 'RETREAT', 'SEMINAR', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ContributionType" AS ENUM ('TITHE', 'OFFERING', 'DONATION', 'PLEDGE');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('MOBILE_MONEY', 'CREDIT_CARD', 'BANK_TRANSFER', 'CASH');

-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'MEMBER',
    "language" "public"."Language" NOT NULL DEFAULT 'EN',
    "avatarUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "public"."MembershipStatus" NOT NULL DEFAULT 'NEW',
    "memberId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."members" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "maritalStatus" TEXT,
    "nationality" TEXT,
    "occupation" TEXT,
    "address" TEXT,
    "baptismDate" TIMESTAMP(3),
    "confirmationDate" TIMESTAMP(3),
    "dateJoined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "spouseName" TEXT,
    "spousePhone" TEXT,
    "numberOfChildren" INTEGER,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "spiritualMaturity" TEXT,
    "ministryPreferences" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."family_members" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "isMember" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "family_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."services" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "serviceType" "public"."ServiceType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "preacherId" TEXT,
    "choirLeaderId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "attendanceCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."attendance" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sermons" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "preacherId" TEXT NOT NULL,
    "serviceId" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "theme" TEXT,
    "scripture" TEXT,
    "audioUrl" TEXT,
    "videoUrl" TEXT,
    "text" TEXT,
    "tags" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sermons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "eventType" "public"."EventType" NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "maxParticipants" INTEGER,
    "organizerId" TEXT NOT NULL,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."event_registrations" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."marriage_requests" (
    "id" TEXT NOT NULL,
    "brideName" TEXT NOT NULL,
    "groomName" TEXT NOT NULL,
    "bridePhone" TEXT NOT NULL,
    "groomPhone" TEXT NOT NULL,
    "brideEmail" TEXT,
    "groomEmail" TEXT,
    "weddingDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "witness1Name" TEXT NOT NULL,
    "witness1Phone" TEXT NOT NULL,
    "witness2Name" TEXT NOT NULL,
    "witness2Phone" TEXT NOT NULL,
    "documentsSubmitted" TEXT[],
    "requesterId" TEXT NOT NULL,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT,

    CONSTRAINT "marriage_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."baptism_requests" (
    "id" TEXT NOT NULL,
    "childName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "parent1Name" TEXT NOT NULL,
    "parent1Phone" TEXT NOT NULL,
    "parent1Email" TEXT,
    "parent2Name" TEXT,
    "parent2Phone" TEXT,
    "parent2Email" TEXT,
    "pastorNotes" TEXT,
    "requesterId" TEXT NOT NULL,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "scheduledDate" TIMESTAMP(3),
    "certificateUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT,

    CONSTRAINT "baptism_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contributions" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "contributionType" "public"."ContributionType" NOT NULL,
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "transactionId" TEXT NOT NULL,
    "receiptUrl" TEXT,
    "notes" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "eventId" TEXT,
    "sermonId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "relatedEventId" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."prayer_requests" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "request" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "responded" BOOLEAN NOT NULL DEFAULT false,
    "response" TEXT,
    "pastorId" TEXT,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prayer_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."counseling_appointments" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "pastorId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "counseling_appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_Ushers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Ushers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "public"."users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "members_userId_key" ON "public"."members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "services_preacherId_key" ON "public"."services"("preacherId");

-- CreateIndex
CREATE UNIQUE INDEX "services_choirLeaderId_key" ON "public"."services"("choirLeaderId");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_serviceId_memberId_key" ON "public"."attendance"("serviceId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "sermons_serviceId_key" ON "public"."sermons"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_eventId_memberId_key" ON "public"."event_registrations"("eventId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "contributions_transactionId_key" ON "public"."contributions"("transactionId");

-- CreateIndex
CREATE INDEX "_Ushers_B_index" ON "public"."_Ushers"("B");

-- AddForeignKey
ALTER TABLE "public"."members" ADD CONSTRAINT "members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."family_members" ADD CONSTRAINT "family_members_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."services" ADD CONSTRAINT "services_preacherId_fkey" FOREIGN KEY ("preacherId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."services" ADD CONSTRAINT "services_choirLeaderId_fkey" FOREIGN KEY ("choirLeaderId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attendance" ADD CONSTRAINT "attendance_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attendance" ADD CONSTRAINT "attendance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sermons" ADD CONSTRAINT "sermons_preacherId_fkey" FOREIGN KEY ("preacherId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sermons" ADD CONSTRAINT "sermons_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_registrations" ADD CONSTRAINT "event_registrations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_registrations" ADD CONSTRAINT "event_registrations_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."marriage_requests" ADD CONSTRAINT "marriage_requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."marriage_requests" ADD CONSTRAINT "marriage_requests_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."marriage_requests" ADD CONSTRAINT "marriage_requests_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."baptism_requests" ADD CONSTRAINT "baptism_requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."baptism_requests" ADD CONSTRAINT "baptism_requests_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."baptism_requests" ADD CONSTRAINT "baptism_requests_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contributions" ADD CONSTRAINT "contributions_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contributions" ADD CONSTRAINT "contributions_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."media" ADD CONSTRAINT "media_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."media" ADD CONSTRAINT "media_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."media" ADD CONSTRAINT "media_sermonId_fkey" FOREIGN KEY ("sermonId") REFERENCES "public"."sermons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_relatedEventId_fkey" FOREIGN KEY ("relatedEventId") REFERENCES "public"."events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prayer_requests" ADD CONSTRAINT "prayer_requests_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prayer_requests" ADD CONSTRAINT "prayer_requests_pastorId_fkey" FOREIGN KEY ("pastorId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."counseling_appointments" ADD CONSTRAINT "counseling_appointments_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."counseling_appointments" ADD CONSTRAINT "counseling_appointments_pastorId_fkey" FOREIGN KEY ("pastorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_Ushers" ADD CONSTRAINT "_Ushers_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_Ushers" ADD CONSTRAINT "_Ushers_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
