import { OrderProductDto } from "src/orderProduct/orderProduct.dto";

export class ProductDto {
        name?:string
        id?:number
        price?: number
        description?: string
        imageUrl?: string
        addedProperty?: Record<string, any>
        sold?:number
        countInStock?:number
}