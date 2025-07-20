import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  // 사용자 정보 조회
  @Get('me')
  async getUser() {
    return this.service.getMockUser();
  }
}
