import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  // --- SECTION 1: FEE COLLECTION (The New Stuff) ---

  async checkFeeStatus(studentId: string) {
    // 1. Get Student & their Payment History
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: { feesPaid: true }
    });

    if (!student) throw new NotFoundException('Student not found');

    // 2. Calculate Totals
    const totalPaid = student.feesPaid.reduce((sum, record) => sum + record.amount, 0);
    const pending = student.feeAgreed - totalPaid;

    return {
      studentName: student.fullName,
      totalFee: student.feeAgreed,
      paidSoFar: totalPaid,
      pendingAmount: pending 
    };
  }

  collectFee(data: any) {
    return this.prisma.feeRecord.create({
      data: {
        studentId: data.studentId,
        amount: parseFloat(data.amount),
        remarks: data.remarks,
      }
    });
  }

  // --- SECTION 2: EXPENSE MANAGEMENT (The Missing Stuff) ---

  createExpense(data: any) {
    return this.prisma.expense.create({
      data: {
        title: data.title,
        category: data.category,
        amount: parseFloat(data.amount),
        vendor: data.vendor || null,
        quantity: data.quantity ? parseInt(data.quantity) : null,
        unitPrice: data.unitPrice ? parseFloat(data.unitPrice) : null,
        description: data.description || '',
      },
    });
  }

  findAllExpenses() {
    return this.prisma.expense.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async getSummary() {
    const expenses = await this.prisma.expense.aggregate({
      _sum: { amount: true },
    });
    
    const income = await this.prisma.feeRecord.aggregate({
      _sum: { amount: true },
    });

    const totalIncome = income._sum.amount || 0;
    const totalExpenses = expenses._sum.amount || 0;

    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
    };
  }
}