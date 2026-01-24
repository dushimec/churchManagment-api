import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding About sections...');

    const aboutSections = [
        {
            type: 'WHO_WE_ARE',
            title: 'Who We Are?',
            content: 'We are a Christ-centered community dedicated to spreading the gospel, nurturing spiritual growth, and building strong families. Our church is a home for all, where faith, hope, and love come alive through service and fellowship.'
        },
        {
            type: 'MISSION',
            title: 'Our Mission',
            content: 'To bring people closer to Christ through worship, discipleship, and service.'
        },
        {
            type: 'VISION',
            title: 'Our Vision',
            content: 'A Christ-centered community where lives are transformed by the Word of God.'
        },
        {
            type: 'HISTORY',
            title: 'Our History',
            content: 'Established in 1990, our church has grown into a vibrant family of believers who worship, learn, and serve together.'
        }
    ];

    for (const section of aboutSections) {
        await (prisma.aboutSection as any).upsert({
            where: { type: section.type },
            update: section,
            create: section,
        });
    }

    console.log('Seeding Leadership...');

    const leads = [
        { name: 'Nishimwe Celie', role: 'Senior Pastor', sequence: 1 },
        { name: 'Nishimwe Celie', role: 'Choir Leader', sequence: 2 },
        { name: 'Nishimwe Celie', role: 'Church Treasurer', sequence: 3 },
        { name: 'Nishimwe Celie', role: 'Youth Leader', sequence: 4 },
        { name: 'Nishimwe Celie', role: 'Cellular Leader', sequence: 5 },
    ];

    for (const lead of leads) {
        await (prisma.leadership as any).create({
            data: lead
        });
    }

    console.log('Seed completed successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
