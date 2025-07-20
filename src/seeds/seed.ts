import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Membership } from '../membership/entities/membership.entity';
import { MembershipPlan } from '../membership/entities/plan.entity';
import { CustomerType } from '../enums/customer-type';
import { config } from 'dotenv';
import * as path from 'path';
import jwt from 'jsonwebtoken';

config({ path: path.resolve(process.cwd(), '.env') });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [User, Membership, MembershipPlan],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('DB connected');

  const planRepo = AppDataSource.getRepository(MembershipPlan);
  const userRepo = AppDataSource.getRepository(User);
  const membershipRepo = AppDataSource.getRepository(Membership);

  const plan = planRepo.create({
    name: '프리미엄 플랜',
    description: '수업 6회 + 웨비나 + 스터디 클럽',
    durationDays: 60,
    chatUses: 20,
    analysisUses: 5,
    target: 'B2C',
    price: 99000,
  });
  await planRepo.save(plan);

  const user = userRepo.create({
    name: '김링글',
    email: 'ringle_dev@test.com',
    region: 'Asia/Seoul',
    profileImage:
      'https://plus.unsplash.com/premium_photo-1661299240086-395bbd605ff0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1pbi1zYW1lLXNlcmllc3wxfHx8ZW58MHx8fHx8',
    customerType: CustomerType.B2C,
  });
  await userRepo.save(user);

  const membership = membershipRepo.create({
    user,
    plan,
    startedAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
    remainingChatUses: 20,
    remainingAnalysisUses: 5,
    grantedByAdmin: false,
    isExpired: false,
  });
  await membershipRepo.save(membership);

  // 임시 토큰 발급
  const JWT_SECRET = process.env.JWT_SECRET || 'big-life-secret';
  const payload = {
    id: user.id,
    email: user.email,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
  console.log(`🪪 Generated JWT token for seeded user:`);
  console.log(`Bearer ${token}`);

  console.log('Seeding complete!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
