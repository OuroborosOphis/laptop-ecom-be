import { OrderEntity } from "src/order/order.entity";
import { ProductEntity } from "src/product/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrderProductEntity {
    @PrimaryGeneratedColumn()
    id:number 

    @Column()
    quantity:number

    @Column('decimal')
    price:number

    @ManyToOne(()=>ProductEntity,product => product.orderProduct)
    product:ProductEntity

    @ManyToOne(()=>OrderEntity,order=>order.orderProduct)
    order:OrderEntity
}