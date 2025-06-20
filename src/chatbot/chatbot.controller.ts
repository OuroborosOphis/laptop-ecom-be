import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('api/chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  async handleChatMessage(@Body() body: { message: string; context?: any[] }) {
    try {
      const response = await this.chatbotService.processMessage(body.message, body.context);
      return { response };
    } catch (error) {
      console.error('Chatbot error:', error);
      return { response: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.' };
    }
  }
}