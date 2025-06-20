import { forwardRef, Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductEntity } from "./product.entity";
import { ProductService } from "./product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderModule } from "src/order/order.module";


@Module({
    imports:[TypeOrmModule.forFeature([ProductEntity]),forwardRef(()=>OrderModule)],
    controllers:[ProductController],
    providers:[ProductService],
    exports:[ProductService]
})
export class ProductModule {

}