import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignUpRequestDto } from './dto/request/sign-up.request.dto';
import { SignInRequestDto } from './dto/request/sign-in.request.dto';
import { TokenService } from '../token/token.service';
import { SignUpResponseDto } from './dto/response/sign-up.response.dto';
import { SignInResponseDto } from './dto/response/sign-in.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(args: SignUpRequestDto): Promise<SignUpResponseDto> {
    const { nickname, email, password } = args;
    await this.usersService.validateEmailDuplicate(email);
    await this.usersService.validateNicknameDuplicate(nickname);
    const registeredUser = await this.usersService.registerUser(
      nickname,
      email,
      password,
    );
    return {
      nickname: registeredUser.nickname,
      email: registeredUser.email,
      createdAt: registeredUser.createdAt,
    };
  }

  async signIn(args: SignInRequestDto): Promise<SignInResponseDto> {
    const { email, password } = args;
    const user = await this.usersService.findUserByEmail(email);
    this.verifyPassword(password, user.password);
    const accessToken = await this.tokenService.issueUserAccessToken({
      id: user.id,
      email: user.email,
    });
    return { accessToken };
  }

  private verifyPassword(inputPassword: string, originPassword: string): void {
    if (inputPassword !== originPassword)
      throw new InternalServerErrorException('비밀번호 불일치!');
  }
}
