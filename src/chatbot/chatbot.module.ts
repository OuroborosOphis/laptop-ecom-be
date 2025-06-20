import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { Laptop } from './laptop.entity';
// Import Laptop entity - bạn cần tạo entity này theo database schema

@Module({
  imports: [
    TypeOrmModule.forFeature([Laptop]) // Thay Laptop bằng entity thực tế của bạn
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}