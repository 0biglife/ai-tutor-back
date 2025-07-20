import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MembershipPlan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column() name!: string;
  @Column({ default: '' }) description!: string;
  @Column() durationDays!: number;

  @Column({ nullable: true }) chatUses!: number;
  @Column({ nullable: true }) analysisUses!: number;

  @Column({ type: 'enum', enum: ['B2C', 'B2B'] })
  target!: 'B2C' | 'B2B';

  @Column('int') price!: number;
}
