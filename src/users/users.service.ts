import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // 1. Encrypt the password (Security First!)
    const salt = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    try {
      // 2. Save to Database
      const newUser = await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          password: hashedPassword, // Storing the hash, not plain text
          role: createUserDto.role,
        },
      });

      // 3. Return the result (but hide the password)
      const { password, ...result } = newUser;
      return result;

    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('This username already exists');
      }
      throw error;
    }
  }

  // Placeholders for future features
  findAll() { return `This action returns all users`; }
  findOne(id: number) { return `This action returns a #${id} user`; }
  update(id: number, updateUserDto: any) { return `This action updates a #${id} user`; }
  remove(id: number) { return `This action removes a #${id} user`; }
}