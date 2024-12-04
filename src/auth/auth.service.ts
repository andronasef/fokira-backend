import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

interface UserDto {
  email: string;
  name: string;
  avatar?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userData: UserDto) {
    const { email, name, avatar } = userData;
    
    // Find or create user
    const user = await this.prisma.user.upsert({
      where: { email },
      update: {
        name,
        avatar,
      },
      create: {
        email,
        name,
        avatar,
      },
    });

    return user;
  }

  async generateToken(user: any) {
    const payload = { 
      sub: user.id,
      email: user.email,
      name: user.name,
    };
    
    return this.jwtService.sign(payload);
  }
}
