import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Email already in use.');
    }

    const existingUserByCpf = await this.prisma.user.findUnique({
      where: { cpfCnpj: createUserDto.cpfCnpj },
    });

    if (existingUserByCpf) {
      throw new ConflictException('CPF/CNPJ already in use.');
    }

    const existingUserByUsername = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existingUserByUsername) {
      throw new ConflictException('Username already in use.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return this.excludePassword(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.excludePassword(user));
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return this.excludePassword(user);
  }

  // Helper method for auth validation
  async findOneByEmailForAuth(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Ensure user exists

    const data: any = { ...updateUserDto };

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already in use by another user.');
      }
    }

    if (updateUserDto.cpfCnpj) {
      const existingUserByCpf = await this.prisma.user.findUnique({
        where: { cpfCnpj: updateUserDto.cpfCnpj },
      });
      if (existingUserByCpf && existingUserByCpf.id !== id) {
        throw new ConflictException('CPF/CNPJ already in use by another user.');
      }
    }

    if (updateUserDto.username) {
      const existingUserByUsername = await this.prisma.user.findUnique({
        where: { username: updateUserDto.username },
      });
      if (existingUserByUsername && existingUserByUsername.id !== id) {
        throw new ConflictException('Username already in use by another user.');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.excludePassword(updatedUser);
  }

  async remove(id: number) {
    await this.findOne(id); // Ensure user exists

    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });

    return this.excludePassword(deletedUser);
  }

  private excludePassword(user: any) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
