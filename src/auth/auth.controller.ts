import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpRequestDto } from './dto/request/sign-up.request.dto';
import { SignInRequestDto } from './dto/request/sign-in.request.dto';
import { SignUpResponseDto } from './dto/response/sign-up.response.dto';
import { SignInResponseDto } from './dto/response/sign-in.response.dto';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({
    summary: '회원가입',
  })
  async signUp(
    @Body() signUpRequestDto: SignUpRequestDto,
  ): Promise<SignUpResponseDto> {
    return await this.authService.signUp(signUpRequestDto);
  }

  @Post('sign-in')
  @ApiOperation({
    summary: '로그인',
  })
  async signIn(
    @Body() signInRequestDto: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    return await this.authService.signIn(signInRequestDto);
  }
}
