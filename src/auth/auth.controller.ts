import { Body, Controller, Post, SerializeOptions } from "@nestjs/common";
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
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
  @ApiCreatedResponse({
    description: '회원가입 정보',
    type: SignUpResponseDto,
  })
  @SerializeOptions({ type: SignUpResponseDto })
  async signUp(
    @Body() signUpRequestDto: SignUpRequestDto,
  ): Promise<SignUpResponseDto> {
    return await this.authService.signUp(signUpRequestDto);
  }

  @Post('sign-in')
  @ApiOperation({
    summary: '로그인',
  })
  @ApiCreatedResponse({
    description: '로그인 정보',
    type: SignInResponseDto,
  })
  @SerializeOptions({ type: SignInResponseDto })
  async signIn(
    @Body() signInRequestDto: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    return await this.authService.signIn(signInRequestDto);
  }
}
