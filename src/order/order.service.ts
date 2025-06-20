import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ORDER_STATUS, OrderEntity } from "./order.entity";
import { Repository } from "typeorm";
import { OrderDto } from "./dto/order.dto";
import { ProductService } from "src/product/product.service";
import { OrderProductEntity } from "src/orderProduct/orderProduct.entity";
import { UserService } from "src/user/user.service";
import { PAYMENTMETHOD } from "./dto/paymentMethod.enum";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity) 
        private readonly OrderRepository: Repository<OrderEntity>,
        @InjectRepository(OrderProductEntity)
        private readonly OrderProductRepository: Repository<OrderProductEntity>,
        private readonly productService: ProductService,
        private readonly userService: UserService,
    ) { }

    async createOrder(orderDto: OrderDto, id: number): Promise<any> {
        // Kiểm tra orderItems có tồn tại không
        if (!orderDto.orderItems || orderDto.orderItems.length === 0) {
            throw new BadRequestException('Đơn hàng phải có ít nhất một sản phẩm')
        }

        // Kiểm tra tồn kho
        const stockCheckPromises = orderDto.orderItems.map(async (item) => {
            if (!item.name || !item.quantity) {
                return {
                    err: 1,
                    mess: "Thiếu thông tin sản phẩm"
                }
            }

            const foundProduct = await this.productService.findProductByName(item?.name)
            if (!foundProduct) {
                return {
                    err: 1,
                    mess: "Sản phẩm không tồn tại"
                }
            }

            if (foundProduct.countInStock < item.quantity) {
                return {
                    err: 1,
                    mess: "Số lượng sản phẩm không đủ"
                }
            }

            return 1
        })

        const stockCheckResults = await Promise.all(stockCheckPromises)
        const checkErrorStock = stockCheckResults.filter(item => item !== 1)
        
        if (checkErrorStock.length > 0) {
            return {
                err: 1,
                mess: "Có một số sản phẩm không đủ số lượng"
            }
        }

        // Cập nhật số lượng và tính tổng tiền
        let totalPrice = 0
        const orderProducts: OrderProductEntity[] = []
        
        const updateProductPromises = orderDto.orderItems.map(async (item) => {
            const foundProduct = await this.productService.findProductByName(item?.name??'')
            if (!foundProduct || !item.quantity) return

            foundProduct.countInStock -= item.quantity
            foundProduct.sold += item.quantity
            totalPrice += foundProduct.price * item.quantity

            // Tạo order product
            const orderProduct = new OrderProductEntity()
            orderProduct.quantity = item.quantity
            orderProduct.product = foundProduct
            orderProduct.price = foundProduct.price
            orderProducts.push(orderProduct)

            return await this.productService.updateProduct(foundProduct.id, foundProduct)
        })

        await Promise.all(updateProductPromises);

        // Tạo và lưu order
        const order = new OrderEntity()
        order.totalPrice = totalPrice
        order.status = ORDER_STATUS.PENDING
        order.user = await this.userService.findOne(id)
        order.paymentmethod = orderDto.paymentMethod ?? PAYMENTMETHOD.CASH
        order.shippingAddress.address = orderDto.shippingAddress?.addrress ?? ''
        order.shippingAddress.email = orderDto.shippingAddress?.email ?? ''
        order.shippingAddress.phone = orderDto.shippingAddress?.phone ?? ''
        order.shippingAddress.fullName = orderDto.shippingAddress?.fullName ?? ''
        const newOrder = await this.OrderRepository.save(order)

        // Lưu order products
        for (const orderProduct of orderProducts) {
            orderProduct.order = newOrder;
            await this.OrderProductRepository.save(orderProduct)
        }

        // Cập nhật lại order với danh sách order products
        newOrder.orderProduct = orderProducts
         await this.OrderRepository.save(newOrder)
         return {
    orderId: newOrder.id,
    userId: id,
    status: newOrder.status,
    totalPrice: newOrder.totalPrice,
    orderProducts: newOrder.orderProduct.map(op => ({
        orderProductId: op.id,
        quantity: op.quantity,
        price: op.price,
        product: {
            productId: op.product.id,
            nameProduct: op.product.name,
            price: op.product.price
        }
    }))
}
    }

    async getAllOrder():Promise<any>{
        return await this.OrderRepository.find({
            relations:['user','orderProduct']
        })
    }
    async findOrderById(id:number):Promise<any>{
        return await this.OrderRepository.findOne({where:{id}})
    }

    async updateOrder(id:number,orderDto:OrderDto):Promise<any> {
        const foundOrder = await this.OrderRepository.findOne({where:{id}})
        if(!foundOrder) return "order not found"
        return await this.OrderRepository.update(id,orderDto)
    }
    async getQrCode(id:number):Promise<any>{
        const foundOrder = await this.OrderRepository.findOne({where:{ id }})
        if(!foundOrder) return "k tim thay id don hang"
        const bankInfo = {
            accountNumber: '00002075261',
            bankCode: 'TPB', 
            accountName: 'NGUYEN TRONG TAN',
            amount: foundOrder.totalPrice,
            message: 'Thanh toan don hang #1234'
        };

        // Tạo nội dung QR theo chuẩn URL của VietQR (https://vietqr.net)
       const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankCode}-${bankInfo.accountNumber}-qr-only.png?amount=${bankInfo.amount}&addInfo=${bankInfo.message}`;
        return qrUrl
    }
}