
import { OrderItemDto } from "./orderItem.dto"
import { PAYMENTMETHOD } from "./paymentMethod.enum"
import { ShippingAddressDto } from "./shippingDto"


export class OrderDto {
    orderItems?:OrderItemDto[]
    shippingAddress?:ShippingAddressDto
    paymentMethod?:PAYMENTMETHOD.CASH
    shippingPrice?:number
    taxtPrice?:number
    totalPrice?:number
}