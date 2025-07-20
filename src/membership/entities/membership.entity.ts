import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MembershipPlan } from './plan.entity';
import { User } from '../../users/user.entity';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => MembershipPlan, { eager: true })
  @JoinColumn()
  plan!: MembershipPlan;

  @ManyToOne(() => User, (user) => user.memberships) user!: User;

  @Column({ type: 'timestamp' }) startedAt!: Date;

  @Column({ type: 'timestamp' }) expiresAt!: Date;

  @Column({ nullable: true }) remainingChatUses!: number;
  @Column({ nullable: true }) remainingAnalysisUses!: number;

  @Column({ default: false }) grantedByAdmin!: boolean;

  @Column({ default: false }) isExpired!: boolean;
}
