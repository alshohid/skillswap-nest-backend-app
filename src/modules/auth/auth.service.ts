// external imports
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';

// internal imports
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authRepo: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    // 1. Check for existing user (parameterized query via repository)
    const existing = await this.authRepo.findByEmailExists(normalizedEmail);
    if (existing.rows.length > 0) {
      throw new BadRequestException('Email already registered');
    }

    const bcryptSaltRounds = parseInt(
      process.env.BCRYPT_SALT_ROUNDS || '10',
      10,
    );
    const passwordHash = await bcrypt.hash(dto.password, bcryptSaltRounds);

    const result = await this.authRepo.insertUser(
      dto.fullName,
      normalizedEmail,
      passwordHash,
    );

    const user = result.rows[0];
    this.logger.log(`✅ New user registered: ${user.email} (ID: ${user.id})`);

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'User registered successfully',
      data: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        skill_points: user.skill_points,
        created_at: user.created_at,
        access_token: accessToken,
      },
    };
  }

  async validateUser(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const result = await this.authRepo.findUserWithPassword(normalizedEmail);
    const user = result.rows[0];
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Strip the password hash before returning
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Login an existing user and return a JWT access token.
   */
  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`🔑 User logged in: ${user.email}`);

    return {
      success: true,
      message: 'Login successful',
      data: {
        access_token: accessToken,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          skill_points: user.skill_points,
        },
      },
    };
  }

  /**
   * Get the current authenticated user's profile.
   */
  async me(userId: number) {
    const result = await this.authRepo.findUserById(userId);

    if (!result.rows[0]) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    return {
      success: true,
      data: result.rows[0],
    };
  }
}
