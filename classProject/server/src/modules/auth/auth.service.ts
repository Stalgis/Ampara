import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, UserRole, UserDocument } from '../users/users.schema';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { ApiProperty } from '@nestjs/swagger';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      // Handle both Mongoose document and plain object
      const userObj = (user as any).toObject ? (user as any).toObject() : user;
      const { passwordHash, ...result } = userObj;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user role can login
    if (user.role === UserRole.ELDER_USER || user.role === UserRole.VISITOR) {
      throw new UnauthorizedException('This user type cannot login');
    }

    const payload = {
      email: user.email,
      sub: user._id || user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id || user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name, role } = registerDto;

    // Check if user can register (only FAMILY_MEMBER and NURSE)
    if (role === UserRole.ELDER_USER || role === UserRole.VISITOR) {
      throw new BadRequestException('This user type cannot register');
    }

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.usersService.create({
      ...registerDto,
      passwordHash,
    });

    // Handle both Mongoose document and plain object
    const userObj = (user as any).toObject ? (user as any).toObject() : user;
    const payload = {
      email: userObj.email,
      sub: userObj._id || userObj.id,
      role: userObj.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userObj._id || userObj.id,
        email: userObj.email,
        name: userObj.name,
        role: userObj.role,
      },
    };
  }
}
