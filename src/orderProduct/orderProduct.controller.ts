import { Controller,Get } from "@nestjs/common";
import { OrderProductService } from "./orderProduct.service";

@Controller('order-product')
export class OrderProductController {
    constructor(
        private readonly orderProductService:OrderProductService
    ) {}

    @Get('all')
    async getAllOrderProduct():Promise<any> {
        return await this.orderProductService.getAllOrderProduct()
    }
    // @Get(':id')
    // async getOrderProductById():Promise<any> {
    //     return await this.orderProductService.getOrderProductById()
    // }
}