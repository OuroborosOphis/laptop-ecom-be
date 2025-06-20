import { OrderProductEntity } from "src/orderProduct/orderProduct.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @Column('decimal')
    price:number

    @Column()
    description:string

    @Column()
    imageUrl: string

    @Column({
        type:'json',
        nullable:true
    })
    addedProperty:Record<string,any>
    // record tương đương với obj: { [key: string]: any } = { ... }

    @Column()
    sold:number

    @Column()
    countInStock:number

    @CreateDateColumn()
    createdAt:Date 

    @UpdateDateColumn()
    updatedAt:Date

    @DeleteDateColumn()
    deletedAt:Date

    @OneToMany(()=>OrderProductEntity,orderProduct => orderProduct.product)
    orderProduct:OrderProductEntity[]
}