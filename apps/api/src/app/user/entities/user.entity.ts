import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '@shoppingstore/api-interfaces';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  fullname: string;

  @Column()
  email: string;

  @Column({select: false})
  password: string;

  @Column({
      default: UserRole.USER,
      enum: UserRole,
      type: 'enum',
  })
  userRole: UserRole;

  @Column({default: false})
  isActivated: boolean;

  @Column({nullable: true, select: false})
  @Exclude()
  refreshToken: string;

  @Column({nullable: true, select: false})
  @Exclude()
  verificationCode: string;

  @CreateDateColumn()
  created: Date;
}
