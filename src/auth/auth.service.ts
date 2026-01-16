import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string) {
    // 1. Find the user
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid Username');
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid Password');
    }

    // 3. Create the "Key Card" (Payload)
    const payload = { sub: user.id, username: user.username, role: user.role };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { // Send back basic info for the frontend
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
  }
}