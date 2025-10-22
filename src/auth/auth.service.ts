// src/auth/auth.service.ts
import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { UserService } from 'src/user/user.service';
  import { CreateUserDto } from 'src/user/create-user-dto';
  import { LoginDto } from './login-dto';
  import * as bcrypt from 'bcrypt';
  import { User } from 'src/user/user-entity';
  import { ConfigService } from '@nestjs/config';
  
  @Injectable()
  export class AuthService {
    constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
    ) {}
  
    private async generateTokens(user: User) {
      const authCfg = this.configService.get('auth');
  
      const payload = { sub: user.id, email: user.email, role: user.role };
  
      const accessToken = this.jwtService.sign(payload, {
        secret: authCfg.secret,
        expiresIn: authCfg.expiresIn,
      });
  
      const refreshToken = this.jwtService.sign(payload, {
        secret: authCfg.refreshSecret,
        expiresIn: authCfg.refreshExpiresIn,
      });
  
      return { accessToken, refreshToken };
    }
  
    async register(createUserDto: CreateUserDto) {
      const existingUser = await this.userService.findOneByEmail(createUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
  
      const user = await this.userService.createUser(createUserDto);
      return this.generateTokens(user);
    }
  
    async login(loginDto: LoginDto) {
      const user = await this.userService.findOneByEmail(loginDto.email);
      if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return this.generateTokens(user);
    }
  
    async refresh(refreshToken: string) {
      const authCfg = this.configService.get('auth');
  
      try {
        const payload = this.jwtService.verify(refreshToken, {
          secret: authCfg.refreshSecret,
        });
  
        const user = await this.userService.findOne(payload.sub);
        if(user)
        return this.generateTokens(user);
    else return new NotFoundException()
      } catch (e) {
        throw new UnauthorizedException('Invalid refresh token');
      }
    }
  
    async logout() {
      // For production: add Redis token blacklist or remove refresh token in DB
      return { message: 'Logout successful' };
    }
  }
  