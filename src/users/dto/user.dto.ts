import { Membership } from 'src/membership/entities/membership.entity';
import { CustomerType } from 'src/enums/customer-type';

export class UserResponseDto {
  id!: string;
  name!: string;
  email!: string;
  region!: string;
  profileImage?: string;
  customerType!: CustomerType;
  membership!: Membership[];
}
