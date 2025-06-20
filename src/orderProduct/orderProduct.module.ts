import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProductEntity } from './orderProduct.entity';
import { OrderModule } from 'src/order/order.module';
import { ProductModule } from 'src/product/product.module';
import { OrderProductController } from './orderProduct.controller';
import { OrderProductService } from './orderProduct.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProductEntity]),forwardRef(()=>OrderModule),forwardRef(()=>ProductModule)],
  controllers: [OrderProductController],
  providers: [OrderProductService],
  exports: [OrderProductService],
})
export class OrderProductModule {}
