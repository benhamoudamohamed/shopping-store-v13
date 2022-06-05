import { BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, Entity, Unique } from "typeorm";

@Entity()
@Unique(['code'])
export class Coupon extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  code: string;

  @Column()
  discount: number;

  @Column()
  userLimit: number;

  @Column()
  expired: boolean;

  @CreateDateColumn()
  created: Date;
}
