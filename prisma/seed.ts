import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Setup the connection using the Adapter (Just like in your Service)
const connectionString = "postgresql://postgres:Sameer@localhost:5432/aims_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. Initialize Prisma with the adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 3. Create the Dummy Exam
  const exam = await prisma.exam.create({
    data: {
      title: 'JEE Main Mock Test - 01',
      description: 'Standard Full Syllabus Test (Physics)',
      durationMin: 180, // 3 Hours
      totalMarks: 300,
      scheduledAt: new Date(), // Live now
      questions: {
        create: [
          {
            imagePath: 'https://placehold.co/600x200?text=Question+1',
            correctOption: 'A',
            subject: 'Physics',
            difficulty: 'Medium',
            marks: 4,
            negative: -1
          },
          {
            imagePath: 'https://placehold.co/600x200?text=Question+2',
            correctOption: 'C',
            subject: 'Physics',
            difficulty: 'Hard',
            marks: 4,
            negative: -1
          },
          {
            imagePath: 'https://placehold.co/600x200?text=Question+3',
            correctOption: 'B',
            subject: 'Chemistry',
            difficulty: 'Easy',
            marks: 4,
            negative: -1
          }
        ]
      }
    },
  });

  console.log('Created Exam:', exam.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });