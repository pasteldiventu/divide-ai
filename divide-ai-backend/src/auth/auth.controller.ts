import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto'

@ApiTags('Auth')
@Controller('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {

    return this.authService.login(req.user);
  }
}