import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Membership } from 'src/membership/entities/membership.entity';
import { CustomerType } from 'src/enums/customer-type';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column() name!: string;
  @Column() email!: string;
  @Column() region!: string;

  @Column({ nullable: true }) profileImage?: string;

  @Column({ type: 'enum', enum: CustomerType })
  customerType!: CustomerType;

  @OneToMany(() => Membership, (membership) => membership.user, {
    cascade: true,
  })
  memberships!: Membership[];
}
