import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { ProductModel } from "@shoppingstore/api-interfaces";

@Entity()
export class Purchase extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('jsonb', {nullable: false})
  items: ProductModel[];

  @Column()
  subtotal: number;

  @Column()
  coupon: string;

  @Column()
  discount: number;

  @Column()
  grandTotal: number;

  @Column()
  clientName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @CreateDateColumn()
  created: Date;
}
