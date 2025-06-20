import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderProductModule } from 'src/orderProduct/orderProduct.module';
import { ProductModule } from 'src/product/product.module';
import { OrderProductEntity } from 'src/orderProduct/orderProduct.entity';
import { UserEntity } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderProductEntity]),
    forwardRef(() => OrderProductModule),
    forwardRef(() => ProductModule),
    forwardRef(()=>UserModule),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
