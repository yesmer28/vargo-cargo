import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface AuthUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  municipality: string;
}

export interface AuthResponseDto {
  accessToken: string;
  user: AuthUserDto;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const phone = normalizePhone(dto.phone);
    const email = dto.email.trim().toLowerCase();

    const existingByPhone = await this.usersRepository.findOne({
      where: { phone },
    });

    if (existingByPhone) {
      return this.buildAuthResponse(existingByPhone);
    }

    const existingByEmail = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingByEmail) {
      throw new ConflictException('Ya existe una cuenta con este correo.');
    }

    const user = this.usersRepository.create({
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      email,
      phone,
      department: dto.department,
      municipality: dto.municipality.trim(),
    });

    try {
      const saved = await this.usersRepository.save(user);
      return this.buildAuthResponse(saved);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        const existingUser =
          (await this.usersRepository.findOne({ where: { phone } })) ??
          (await this.usersRepository.findOne({ where: { email } }));

        if (existingUser) {
          return this.buildAuthResponse(existingUser);
        }
      }

      throw error;
    }
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const phone = normalizePhone(dto.phone);
    const user = await this.usersRepository.findOne({ where: { phone } });

    if (!user) {
      throw new NotFoundException(
        'No encontramos una cuenta con este teléfono. Regístrese para continuar.',
      );
    }

    return this.buildAuthResponse(user);
  }

  async getProfile(userId: string): Promise<AuthUserDto> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('Sesión no válida.');
    }

    return this.toAuthUser(user);
  }

  private buildAuthResponse(user: User): AuthResponseDto {
    const payload = { sub: user.id, phone: user.phone };

    return {
      accessToken: this.jwtService.sign(payload),
      user: this.toAuthUser(user),
    };
  }

  private toAuthUser(user: User): AuthUserDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      department: user.department,
      municipality: user.municipality,
    };
  }
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function isUniqueConstraintError(error: unknown): boolean {
  if (!(error instanceof QueryFailedError)) {
    return false;
  }

  const driverError = error.driverError as { code?: string } | undefined;
  return driverError?.code === '23505';
}
