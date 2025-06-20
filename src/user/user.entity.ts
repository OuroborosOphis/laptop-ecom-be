// import { BlogEntity } from "src/blog/blog-entity";
import { OrderEntity } from "src/order/order.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    ADMIN ='Admin',
    USER = 'User'
}

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    userName:string

    @Column({unique:true})
    name:string

    @Column({unique:true})
    email:string 

    @Column()
    password:string
    
    @Column({type:'enum',enum:UserRole,default:UserRole.USER})
    role:UserRole

    @Column({nullable:true})
    profileImage:string

    @BeforeInsert()
    emailToLowercase(){
        this.email = this.email.toLowerCase()
    }

    @OneToMany(()=>OrderEntity,order =>  order.user)
    order:OrderEntity
}