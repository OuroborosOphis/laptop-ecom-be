import { Controller, Post, Body, Param,Get, Put } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderDto } from "./dto/order.dto";
import { throws } from "assert";

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}
    @Post('create-order/:id')
    async createOrder(@Body() orderDto:OrderDto,@Param('id') id:string) {
        return await this.orderService.createOrder(orderDto,Number(id))
    }
    @Get('all')
    async getAllOrder(){
        return await this.orderService.getAllOrder()
    }
    @Get(':id')
    async getOrderById(@Param('id') id:string){
        return await this.orderService.findOrderById(Number(id))
    }
    @Put('update/:id')
    async updateOrder(@Body() orderDto:OrderDto,@Param('id') id:string){
        return await this.orderService.updateOrder(Number(id),orderDto)
    }
    @Get('qrcode/:id')
    async getQrCode(@Param('id') id:string){
        return await this.orderService.getQrCode(Number(id))
    }
}