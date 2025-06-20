import { OrderDto } from "src/order/dto/order.dto"
import { ProductDto } from "src/product/product.dto"

export class OrderProductDto {
    id?:number
    quantity?:number
    product?:ProductDto // forgein
    order?:OrderDto // forgein
    // 2 forgein ok 
}