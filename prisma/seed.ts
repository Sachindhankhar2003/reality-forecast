import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Reality Forecast database...');

  const adminPasswordHash = await bcrypt.hash('Dhankhar', 10);

  // 1. Seed Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'sachinadmin.app' },
    update: { name: 'Sachin Admin', role: 'ADMIN', passwordHash: adminPasswordHash },
    create: {
      id: 'sachin-admin-user',
      email: 'sachinadmin.app',
      name: 'Sachin Admin',
      role: 'ADMIN',
      passwordHash: adminPasswordHash,
      profile: {
        create: {
          bio: 'System Administrator for Reality Forecast Console.',
          location: 'Delhi NCR, India',
          timezone: 'Asia/Kolkata',
        },
      },
    },
  });

  // 2. Seed Developer User
  const user = await prisma.user.upsert({
    where: { email: 'developer@delhi.future.app' },
    update: { name: 'Sachin', role: 'USER', passwordHash: adminPasswordHash },
    create: {
      id: 'demo-dev-user',
      email: 'developer@delhi.future.app',
      name: 'Sachin',
      role: 'USER',
      passwordHash: adminPasswordHash,
      profile: {
        create: {
          bio: 'Senior Full Stack Software Engineer preparing for system design & tech interviews in Delhi NCR.',
          location: 'Delhi NCR, India',
          timezone: 'Asia/Kolkata',
          skills: 'TypeScript, Next.js, React, Node.js, System Design, PostgreSQL',
          jobPreferences: 'Senior Full Stack Developer / Software Engineer',
          transportPreferences: 'Car, Delhi Metro',
        },
      },
    },
  });

  console.log(`👤 Admin created: ${adminUser.name} (${adminUser.email})`);
  console.log(`👤 Developer created: ${user.name} (${user.email})`);

  // Update existing user in DB if any
  await prisma.user.updateMany({
    where: { email: { in: ['developer@delhi.future.app', 'demo.developer@example.com'] } },
    data: { name: 'Sachin' },
  });

  // 3. Clean & Seed Stored Memories
  await prisma.memory.deleteMany({ where: { userId: user.id } });
  await prisma.memory.createMany({
    data: [
      {
        userId: user.id,
        category: 'transport',
        key: 'preferred_mode',
        value: 'Prefers car for Delhi NCR trips but keeps Delhi Metro as secondary fallback',
        source: 'user_preference',
        enabled: true,
      },
      {
        userId: user.id,
        category: 'interview',
        key: 'primary_tech_stack',
        value: 'Next.js 15, TypeScript, Node.js, Prisma, PostgreSQL',
        source: 'user_stated',
        enabled: true,
      },
    ],
  });

  // 4. Seed Central Forecast Record
  await prisma.forecast.deleteMany({ where: { id: 'fc-delhi-dev-101' } });
  const forecast = await prisma.forecast.create({
    data: {
      id: 'fc-delhi-dev-101',
      userId: user.id,
      title: 'Software Developer Interview in Delhi',
      originalInput: 'Tomorrow I have a software developer interview in Delhi at 10:00 AM. I will travel by car from Noida.',
      domain: 'interview',
      status: 'READY',
      eventAt: new Date(Date.now() + 24 * 3600 * 1000),
      location: 'Connaught Place, Delhi',
      summary: 'High role alignment for React/TypeScript stack. Main uncertainty stems from peak morning traffic corridor delays across DND Flyway.',
      overallScore: 0.78,
      confidence: 0.88,
      contexts: {
        create: [
          { key: 'Event', value: 'Software Developer Interview', source: 'user_input' },
          { key: 'Date & Time', value: 'Tomorrow at 10:00 AM', source: 'user_input' },
          { key: 'Origin / Destination', value: 'Noida to Delhi', source: 'user_input' },
          { key: 'Travel Mode', value: 'Car', source: 'user_input' },
        ],
      },
      sources: {
        create: [
          {
            provider: 'Open-Meteo Weather API',
            dataType: 'WEATHER',
            confidence: 0.95,
            dataJson: JSON.stringify({ temperature: '31°C', condition: 'Clear', humidity: '45%' }),
          },
          {
            provider: 'TomTom Traffic API',
            dataType: 'TRAFFIC',
            confidence: 0.90,
            dataJson: JSON.stringify({ corridor: 'DND Flyway', congestionLevel: 'HIGH', delayMins: 25 }),
          },
        ],
      },
      factors: {
        create: [
          {
            name: 'Role Profile Match',
            category: 'Skill',
            value: 'Strong alignment with React/TypeScript stack',
            normalizedValue: 0.85,
            weight: 1.5,
            impact: 'POSITIVE',
            evidence: 'Resume matches 85% of target job description requirements',
          },
          {
            name: 'Morning Travel Delay',
            category: 'Traffic',
            value: 'DND Flyway congestion expected around 08:30-09:30 AM',
            normalizedValue: 0.40,
            weight: 1.2,
            impact: 'NEGATIVE',
            evidence: 'TomTom corridor analysis indicates +25 mins congestion delay',
          },
        ],
      },
      scenarios: {
        create: [
          {
            type: 'MOST_LIKELY',
            title: 'Advance to Further Technical Round',
            description: 'Candidate completes technical interview successfully and advances to systemic design discussion round.',
            probability: 0.52,
            confidence: 0.88,
            impactScore: 0.85,
            controllability: 0.70,
            evidence: 'Strong technical resume match and solid fundamental project portfolio.',
            actionsJson: JSON.stringify(['Review React Server Components', 'Prepare STAR stories']),
          },
          {
            type: 'BEST_CASE',
            title: 'Same-Day Offer Recommendation',
            description: 'Outstanding performance across technical and behavioral rounds leads to immediate offer proposal.',
            probability: 0.28,
            confidence: 0.80,
            impactScore: 1.0,
            controllability: 0.60,
            evidence: 'Exceeds target candidate experience requirement for frontend architecture.',
          },
          {
            type: 'NEGATIVE',
            title: 'Travel Delay Causes Interview Reschedule',
            description: 'Peak DND traffic delay forces late arrival resulting in rushed session.',
            probability: 0.14,
            confidence: 0.90,
            impactScore: 0.30,
            controllability: 0.85,
            evidence: 'Narrow 15-minute arrival buffer increases schedule vulnerability.',
          },
          {
            type: 'UNEXPECTED',
            title: 'Format Switch to Remote Architecture Round',
            description: 'Interviewer requests shifting to live remote coding canvas session.',
            probability: 0.06,
            confidence: 0.75,
            impactScore: 0.60,
            controllability: 0.50,
            evidence: 'Company policy supports hybrid evaluation options upon request.',
          },
        ],
      },
      risks: {
        create: [
          {
            title: 'DND Corridor Bottleneck Delay',
            description: 'Heavy morning rush hour traffic between Noida toll bridge and Ring Road.',
            category: 'Travel',
            likelihood: 0.65,
            impact: 0.80,
            controllability: 0.70,
            timeSensitivity: 0.90,
            severity: 'HIGH',
            compositeScore: 7.2,
            mitigation: 'Depart Noida by 08:15 AM (45 mins earlier than default route).',
          },
          {
            title: 'System Design Question Gaps',
            description: 'Role emphasizes micro-frontend state sync which has moderate preparation depth.',
            category: 'Preparation',
            likelihood: 0.45,
            impact: 0.70,
            controllability: 0.90,
            timeSensitivity: 0.60,
            severity: 'MEDIUM',
            compositeScore: 4.8,
            mitigation: 'Practice System Design architecture canvas session.',
          },
        ],
      },
      recommendations: {
        create: [
          {
            title: 'Depart 45 Minutes Earlier via DND Flyway',
            description: 'Leaving by 08:15 AM guarantees a 30-minute buffer before the 10:00 AM interview.',
            expectedBenefit: 0.18,
            effort: 'LOW',
            urgency: 'HIGH',
            controllability: 0.90,
          },
          {
            title: 'Practice Micro-Frontend State Synchronization',
            description: 'Review Zustand & React context patterns to answer architecture trade-off questions.',
            expectedBenefit: 0.14,
            effort: 'MODERATE',
            urgency: 'HIGH',
            controllability: 0.85,
          },
        ],
      },
    },
  });

  console.log(`🔮 Forecast created: ${forecast.title} (ID: ${forecast.id})`);

  // 5. Seed Interview Prep Session
  await prisma.interview.create({
    data: {
      userId: user.id,
      forecastId: forecast.id,
      companyName: 'Delhi TechCorp',
      roleTitle: 'Senior React Developer',
      jobDescription: 'Seeking expert in React 19, TypeScript, Next.js, and state management.',
      technicalReadiness: 0.82,
      communicationReadiness: 0.88,
      behavioralReadiness: 0.75,
      roleMatchScore: 0.85,
      questions: {
        create: [
          {
            questionText: 'Explain the difference between React Server Components and Client Components in Next.js App Router.',
            category: 'Technical',
            difficulty: 'MEDIUM',
            displayOrder: 1,
          },
          {
            questionText: 'Describe a situation where a software delivery timeline was at risk due to external delays. How did you handle it?',
            category: 'Behavioral',
            difficulty: 'MEDIUM',
            displayOrder: 2,
          },
        ],
      },
    },
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
