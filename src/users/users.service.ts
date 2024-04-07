import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Users } from '@prisma/client';
import { UserDto } from './dto/response/user.dto';
import { FollowsService } from '../follows/follows.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly followsService: FollowsService,
  ) {}

  buildUserDto(user: Users): UserDto {
    return {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
    };
  }

  async createUser(args: Prisma.UsersCreateInput): Promise<Users> {
    return await this.prisma.users.create({
      data: { ...args },
    });
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    return await this.prisma.users.findUnique({
      where: { email },
    });
  }

  async findUserByEmailOrThrow(email: string): Promise<Users> {
    const user = await this.findUserByEmail(email);
    if (!user) throw new InternalServerErrorException('이메일 사용자 없음!');
    return user;
  }

  async findUserByNickname(nickname: string): Promise<Users | null> {
    return await this.prisma.users.findUnique({
      where: { nickname },
    });
  }

  async findUserById(userId: number): Promise<Users | null> {
    return await this.prisma.users.findUnique({
      where: { id: userId },
    });
  }

  async findUserByIdOrThrow(userId: number): Promise<Users> {
    const user = await this.findUserById(userId);
    if (!user) throw new InternalServerErrorException('id 유저 없음!');
    return user;
  }

  async validateEmailDuplicate(email: string): Promise<void> {
    const user = await this.findUserByEmail(email);
    if (user) throw new InternalServerErrorException('이메일 중복!');
  }

  async validateNicknameDuplicate(nickname: string): Promise<void> {
    const user = await this.findUserByNickname(nickname);
    if (user) throw new InternalServerErrorException('닉네임 중복!');
  }

  async registerUser(
    nickname: string,
    email: string,
    password: string,
  ): Promise<Users> {
    return await this.createUser({ nickname, email, password });
  }

  async getFollowers(userId: number): Promise<Users[]> {
    const followerUserIds =
      await this.followsService.getFollowerUserIds(userId);

    return await Promise.all(
      followerUserIds.map(
        async (followerUserId) =>
          await this.findUserByIdOrThrow(followerUserId),
      ),
    );
  }

  async getFollowings(userId: number): Promise<Users[]> {
    const followingUserIds =
      await this.followsService.getFollowingUserIds(userId);

    return await Promise.all(
      followingUserIds.map(
        async (followingUserId) =>
          await this.findUserByIdOrThrow(followingUserId),
      ),
    );
  }
}
