import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  // 사용자 정보 조회
  async getMockUser() {
    return this.repo.findOne({
      where: { id: '3e7fc53d-7af5-49a1-b9d0-4768d90ea49d' }, // 로그인 기능이 없기에 임시 구현
      relations: ['memberships', 'memberships.plan'],
    });
  }
}
