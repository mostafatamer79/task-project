import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user-entity';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './create-user-dto';
import { PasswordService } from 'src/password/password.service';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository : Repository<User>,
        private readonly passwordService : PasswordService
    ){}

    public async findOneByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
          throw new NotFoundException(`User with email "${email}" not found`);
        }
        return user;
      }
    
      public async createUser(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findOne({
          where: { email: createUserDto.email },
        });
        const hashPassword = await this.passwordService.hashPassword(createUserDto.password)
    
        const newUser = this.userRepository.create({...createUserDto,password:hashPassword,});
        return await this.userRepository.save(newUser);
      }
      public async findOne(id: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
          throw new NotFoundException(`User with id "${id}" not found`);
        }
        return user;
      }
}
