import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthLoginDTO } from './domain/dto/authLogin.dto';
import { AuthService } from './auth.service';
import { AuthRegisterDTO } from './domain/dto/authRegister.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() body: AuthLoginDTO) {
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }
}
