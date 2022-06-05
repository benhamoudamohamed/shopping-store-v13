import { PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, Entity } from "typeorm";

@Entity()
export class Contactus extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column()
    fullname: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    subject: string;

    @Column()
    message: string;

    @CreateDateColumn()
    created: Date;
}
