import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

// 1. Setup the connection using the Adapter (Just like in your Service)
const connectionString = "postgresql://postgres:Sameer@localhost:5432/aims_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. Initialize Prisma with the adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Batches
  console.log('📚 Creating Batches...');
  const batch1 = await prisma.batch.create({
    data: {
      name: '11th JEE - Batch A',
    },
  });

  const batch2 = await prisma.batch.create({
    data: {
      name: '12th JEE - Batch B',
    },
  });

  // 2. Create Super Admin
  console.log('👤 Creating Super Admin...');
  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  // 3. Create Teachers
  console.log('👨‍🏫 Creating Teachers...');
  const teacher1User = await prisma.user.create({
    data: {
      username: 'teacher_physics',
      password: hashedPassword,
      role: 'TEACHER',
      teacherProfile: {
        create: {
          fullName: 'Dr. Rajesh Kumar',
          email: 'rajesh@aims.edu',
          mobile: '9876543210',
          subject: 'Physics',
          qualification: 'PhD in Physics',
        },
      },
    },
    include: {
      teacherProfile: true,
    },
  });

  const teacher2User = await prisma.user.create({
    data: {
      username: 'teacher_chemistry',
      password: hashedPassword,
      role: 'TEACHER',
      teacherProfile: {
        create: {
          fullName: 'Dr. Priya Sharma',
          email: 'priya@aims.edu',
          mobile: '9876543211',
          subject: 'Chemistry',
          qualification: 'MSc in Chemistry',
        },
      },
    },
    include: {
      teacherProfile: true,
    },
  });

  // 4. Create Question Banks
  console.log('📝 Creating Question Banks...');
  const questionBank1 = await prisma.questionBank.create({
    data: {
      createdById: teacher1User.teacherProfile.id,
      questionText: 'A particle moves with constant acceleration. If its initial velocity is 10 m/s and after 5 seconds it reaches 30 m/s, what is the acceleration?',
      imagePath: 'https://placehold.co/600x200?text=Kinematics+Question',
      options: {
        A: '2 m/s²',
        B: '4 m/s²',
        C: '5 m/s²',
        D: '6 m/s²',
      },
      correctOption: 'B',
      explanation: 'Using v = u + at: 30 = 10 + a(5), therefore a = 4 m/s²',
      subject: 'Physics',
      topic: 'Kinematics',
      difficulty: 'Easy',
      marks: 4,
      negative: -1,
      tags: ['JEE', 'Kinematics', 'Motion'],
    },
  });

  const questionBank2 = await prisma.questionBank.create({
    data: {
      createdById: teacher1User.teacherProfile.id,
      questionText: 'A block of mass 5 kg is pushed on a frictionless surface with a force of 20 N. What is the acceleration?',
      imagePath: 'https://placehold.co/600x200?text=Newton+Laws',
      options: {
        A: '2 m/s²',
        B: '4 m/s²',
        C: '5 m/s²',
        D: '10 m/s²',
      },
      correctOption: 'B',
      explanation: 'Using F = ma: 20 = 5a, therefore a = 4 m/s²',
      subject: 'Physics',
      topic: 'Newton\'s Laws',
      difficulty: 'Medium',
      marks: 4,
      negative: -1,
      tags: ['JEE', 'Newton\'s Laws', 'Mechanics'],
    },
  });

  const questionBank3 = await prisma.questionBank.create({
    data: {
      createdById: teacher2User.teacherProfile.id,
      questionText: 'What is the molecular formula of glucose?',
      imagePath: 'https://placehold.co/600x200?text=Chemistry+Basic',
      options: {
        A: 'C6H12O6',
        B: 'C6H6O6',
        C: 'C5H12O6',
        D: 'C6H12O5',
      },
      correctOption: 'A',
      explanation: 'Glucose has 6 carbon, 12 hydrogen, and 6 oxygen atoms',
      subject: 'Chemistry',
      topic: 'Organic Chemistry',
      difficulty: 'Easy',
      marks: 4,
      negative: -1,
      tags: ['NEET', 'Organic', 'Basics'],
    },
  });

  // 5. Create Exams
  console.log('📋 Creating Exams...');
  const exam1 = await prisma.exam.create({
    data: {
      title: 'JEE Main Mock Test - Physics',
      description: 'Full Physics Mock Test',
      durationMin: 180,
      totalMarks: 300,
      scheduledAt: new Date(),
      isPublished: true,
      createdById: teacher1User.teacherProfile.id,
      questions: {
        create: [
          {
            questionBankId: questionBank1.id,
            questionText: questionBank1.questionText,
            imagePath: questionBank1.imagePath,
            options: questionBank1.options,
            correctOption: questionBank1.correctOption,
            explanation: questionBank1.explanation,
            subject: questionBank1.subject,
            difficulty: questionBank1.difficulty,
            marks: questionBank1.marks,
            negative: questionBank1.negative,
            orderIndex: 1,
          },
          {
            questionBankId: questionBank2.id,
            questionText: questionBank2.questionText,
            imagePath: questionBank2.imagePath,
            options: questionBank2.options,
            correctOption: questionBank2.correctOption,
            explanation: questionBank2.explanation,
            subject: questionBank2.subject,
            difficulty: questionBank2.difficulty,
            marks: questionBank2.marks,
            negative: questionBank2.negative,
            orderIndex: 2,
          },
        ],
      },
    },
  });

  // 6. Create Parents
  console.log('👨‍👩‍👧 Creating Parents...');
  const parent1User = await prisma.user.create({
    data: {
      username: '9988776655',
      password: hashedPassword,
      role: 'PARENT',
      parentProfile: {
        create: {
          mobile: '9988776655',
        },
      },
    },
    include: {
      parentProfile: true,
    },
  });

  // 7. Create Students
  console.log('👨‍🎓 Creating Students...');
  const student1User = await prisma.user.create({
    data: {
      username: 'STU001',
      password: hashedPassword,
      role: 'STUDENT',
      studentProfile: {
        create: {
          fullName: 'Rahul Verma',
          mobile: '9123456780',
          batchId: batch1.id,
          parentId: parent1User.parentProfile.id,
          feeAgreed: 50000,
        },
      },
    },
    include: {
      studentProfile: true,
    },
  });

  const student2User = await prisma.user.create({
    data: {
      username: 'STU002',
      password: hashedPassword,
      role: 'STUDENT',
      studentProfile: {
        create: {
          fullName: 'Priya Singh',
          mobile: '9123456781',
          batchId: batch2.id,
          feeAgreed: 60000,
        },
      },
    },
    include: {
      studentProfile: true,
    },
  });

  // 8. Create Fee Records
  console.log('💰 Creating Fee Records...');
  await prisma.feeRecord.create({
    data: {
      studentId: student1User.studentProfile.id,
      amount: 15000,
      remarks: 'First installment',
    },
  });

  await prisma.feeRecord.create({
    data: {
      studentId: student2User.studentProfile.id,
      amount: 20000,
      remarks: 'First installment',
    },
  });

  // 9. Create Test Attempt with Answers
  console.log('📊 Creating Test Attempts...');
  const attempt = await prisma.testAttempt.create({
    data: {
      userId: student1User.id,
      examId: exam1.id,
      status: 'SUBMITTED',
      totalScore: 3,
      correctCount: 1,
      wrongCount: 1,
      skippedCount: 0,
      startedAt: new Date(),
      submittedAt: new Date(),
      timeSpentSec: 3600,
    },
  });

  // Get questions from the exam
  const examQuestions = await prisma.question.findMany({
    where: { examId: exam1.id },
    orderBy: { orderIndex: 'asc' },
  });

  // Create individual answers
  await prisma.answer.create({
    data: {
      attemptId: attempt.id,
      questionId: examQuestions[0].id,
      selectedOption: 'B',
      isCorrect: true,
      marksAwarded: 4,
      timeSpentSec: 120,
    },
  });

  await prisma.answer.create({
    data: {
      attemptId: attempt.id,
      questionId: examQuestions[1].id,
      selectedOption: 'A',
      isCorrect: false,
      marksAwarded: -1,
      timeSpentSec: 180,
    },
  });

  // 10. Create Notices
  console.log('📢 Creating Notices...');
  await prisma.notice.create({
    data: {
      title: 'Holiday Announcement',
      content: 'Institute will remain closed on 26th January',
    },
  });

  await prisma.notice.create({
    data: {
      title: 'Mock Test Schedule',
      content: 'Monthly test will be conducted on 20th',
      batchId: batch1.id,
    },
  });

  // 11. Create Resources
  console.log('📚 Creating Resources...');
  await prisma.resource.create({
    data: {
      title: 'Newton\'s Laws Video Lecture',
      type: 'VIDEO',
      url: 'https://youtube.com/watch?v=example',
      batchId: batch1.id,
    },
  });

  await prisma.resource.create({
    data: {
      title: 'Kinematics Notes PDF',
      type: 'NOTE',
      url: 'https://drive.google.com/file/example',
      batchId: batch1.id,
    },
  });

  // 12. Create Expenses
  console.log('💸 Creating Expenses...');
  await prisma.expense.create({
    data: {
      title: 'January Rent',
      category: 'Rent',
      amount: 50000,
      description: 'Monthly rent for institute building',
    },
  });

  await prisma.expense.create({
    data: {
      title: 'Physics Books Purchase',
      category: 'Books',
      amount: 25000,
      vendor: 'Arihant Publications',
      quantity: 50,
      unitPrice: 500,
      description: 'HC Verma Physics books for students',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log('- 2 Batches created');
  console.log('- 1 Admin, 2 Teachers, 2 Students, 1 Parent created');
  console.log('- 3 Questions in question bank');
  console.log('- 1 Exam with 2 questions created');
  console.log('- 1 Test attempt with detailed answers');
  console.log('- 2 Fee records, 2 Notices, 2 Resources, 2 Expenses');
  console.log('\n🔑 Login Credentials:');
  console.log('Admin: admin / password123');
  console.log('Teacher (Physics): teacher_physics / password123');
  console.log('Teacher (Chemistry): teacher_chemistry / password123');
  console.log('Student 1: STU001 / password123');
  console.log('Student 2: STU002 / password123');
  console.log('Parent: 9988776655 / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });