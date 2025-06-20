import { InjectRepository } from "@nestjs/typeorm";
import { OrderProductEntity } from "./orderProduct.entity";
import { Repository } from "typeorm";
import { ProductService } from "src/product/product.service";
import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { OrderService } from "src/order/order.service";

@Injectable()
export class OrderProductService {
    constructor(@InjectRepository(OrderProductEntity) 
                private readonly orderProductRepository:Repository<OrderProductEntity>,
                private readonly productService:ProductService,
                private readonly orderService:OrderService
            ) { }
   async getAllOrderProduct():Promise<any> {
        return await this.orderProductRepository.find({
            relations:['product']
        })
    }
  
}