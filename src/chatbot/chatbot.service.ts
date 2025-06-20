import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Laptop } from './laptop.entity';

interface LaptopRecommendation {
  laptops: Laptop[];
  summary: string;
}

interface PriceRange {
  min?: number;
  max?: number;
}

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: any;

  constructor(
    @InjectRepository(Laptop)
    private laptopRepository: Repository<Laptop>,
  ) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      this.logger.log('Successfully initialized Gemini AI model');
    } catch (error) {
      this.logger.error('Failed to initialize Gemini AI:', error);
      throw error;
    }
  }

  private cleanResponse(text: string): string {
    // Remove markdown formatting
    return text
      .replace(/\*\*/g, '') // Remove bold
      .replace(/\*/g, '')   // Remove italic
      .replace(/^[-*]\s*/gm, '• ') // Convert markdown lists to bullet points
      .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
      .trim();
  }

  private extractPriceRange(message: string): PriceRange {
    const result: PriceRange = {};
    const lowercaseMessage = message.toLowerCase();

    // Tìm các pattern giá phổ biến
    const pricePatterns = [
      /(\d+)\s*triệu/g,
      /dưới\s*(\d+)\s*triệu/g,
      /trên\s*(\d+)\s*triệu/g,
      /từ\s*(\d+)\s*đến\s*(\d+)\s*triệu/g
    ];

    for (const pattern of pricePatterns) {
      const matches = [...lowercaseMessage.matchAll(pattern)];
      if (matches.length > 0) {
        const match = matches[0];
        if (pattern.source.includes('dưới')) {
          result.max = parseInt(match[1]) * 1000000;
        } else if (pattern.source.includes('trên')) {
          result.min = parseInt(match[1]) * 1000000;
        } else if (pattern.source.includes('từ.*đến')) {
          result.min = parseInt(match[1]) * 1000000;
          result.max = parseInt(match[2]) * 1000000;
        } else {
          // Nếu chỉ có một số, coi như là giá tối đa
          result.max = parseInt(match[1]) * 1000000;
        }
      }
    }

    return result;
  }

  private async findRelevantLaptops(message: string): Promise<LaptopRecommendation> {
    const lowercaseMessage = message.toLowerCase();
    
    // Extract price range
    const priceRange = this.extractPriceRange(message);
    
    // Extract category keywords
    const categoryKeywords: Record<string, string[]> = {
      gaming: ['game', 'gaming', 'chơi game', 'đồ họa cao'],
      office: ['văn phòng', 'office', 'nhẹ', 'di động'],
      design: ['đồ họa', 'design', 'thiết kế', 'render'],
      student: ['sinh viên', 'học tập', 'student']
    };

    let category: string | null = null;
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowercaseMessage.includes(keyword))) {
        category = cat;
        break;
      }
    }

    // Build query
    let query = this.laptopRepository.createQueryBuilder('laptop')
      .where('laptop.in_stock = :inStock', { inStock: true });

    // Add price filters
    if (priceRange.min) {
      query = query.andWhere('laptop.price >= :minPrice', { minPrice: priceRange.min });
    }
    if (priceRange.max) {
      query = query.andWhere('laptop.price <= :maxPrice', { maxPrice: priceRange.max });
    }

    // Add category filter
    if (category) {
      query = query.andWhere('laptop.category = :category', { category });
    }

    // Add brand filter
    const brands = ['asus', 'dell', 'hp', 'lenovo', 'acer', 'msi', 'apple', 'lg'];
    const mentionedBrands = brands.filter(brand => lowercaseMessage.includes(brand));
    if (mentionedBrands.length > 0) {
      query = query.andWhere('LOWER(laptop.brand) IN (:...brands)', { brands: mentionedBrands });
    }

    // Add some basic filters based on category
    if (category === 'gaming') {
      query = query.andWhere('laptop.gpu NOT LIKE :integratedGPU', { integratedGPU: '%Intel%' });
    } else if (category === 'office') {
      query = query.andWhere('laptop.weight <= :maxWeight', { maxWeight: 2.0 });
    }

    // Get laptops
    const laptops = await query
      .orderBy('laptop.price', 'ASC')
      .take(5)
      .getMany();

    // Generate summary
    let summary = '';
    if (laptops.length > 0) {
      summary = `Dựa trên yêu cầu của bạn, tôi tìm thấy ${laptops.length} laptop phù hợp:\n\n`;
      laptops.forEach((laptop, index) => {
        summary += `${index + 1}. ${laptop.brand} ${laptop.name}\n`;
        summary += `   • Giá: ${(laptop.price / 1000000).toFixed(1)} triệu\n`;
        summary += `   • CPU: ${laptop.cpu}\n`;
        summary += `   • RAM: ${laptop.ram}\n`;
        summary += `   • GPU: ${laptop.gpu}\n`;
        summary += `   • Màn hình: ${laptop.screen_size}\n\n`;
      });
    } else {
      summary = 'Xin lỗi, tôi không tìm thấy laptop nào phù hợp với yêu cầu của bạn. ';
      if (priceRange.max) {
        summary += `Bạn có thể thử tăng ngân sách lên trên ${priceRange.max / 1000000} triệu hoặc điều chỉnh các tiêu chí khác.`;
      } else {
        summary += 'Bạn có thể cho tôi biết thêm về ngân sách và mục đích sử dụng không?';
      }
    }

    return { laptops, summary };
  }

  async processMessage(message: string, context: any[] = []): Promise<any> {
    try {
      // Find relevant laptops
      const recommendation = await this.findRelevantLaptops(message);
      
      // Create system prompt with laptop data
      const systemPrompt = {
        role: 'user',
        parts: [{
          text: `Bạn là một trợ lý bán laptop chuyên nghiệp. 
          Dưới đây là danh sách laptop phù hợp với yêu cầu của khách hàng:
          ${recommendation.summary}
          
          Hãy trả lời câu hỏi của khách hàng dựa trên thông tin laptop có sẵn.
          Nếu không có laptop phù hợp, hãy đề xuất các tiêu chí phù hợp để khách hàng có thể tìm laptop khác.
          Luôn trả lời bằng tiếng Việt.
          
          Lưu ý:
          - Không sử dụng định dạng markdown (*, **, #, etc.)
          - Sử dụng dấu gạch đầu dòng (•) cho danh sách
          - Giữ câu trả lời ngắn gọn, dễ đọc
          - Nếu liệt kê laptop, hãy nêu rõ giá và cấu hình chính
          - Nếu không có laptop phù hợp, hãy giải thích lý do và đề xuất các tiêu chí thay thế`
        }]
      };

      const initialResponse = {
        role: 'model',
        parts: [{
          text: 'Tôi hiểu rồi. Tôi sẽ giúp khách hàng tìm laptop phù hợp dựa trên danh sách có sẵn và trả lời bằng văn bản thuần túy, dễ đọc.'
        }]
      };

      // Convert context messages to proper format and ensure valid roles
      const formattedContext = context.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }]
      }));

      // Combine all history
      const history = [systemPrompt, initialResponse, ...formattedContext];

      // Start chat with history
      const chat = this.model.startChat({
        history: history,
      });

      // Send user message
      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();
      // console.log('Raw Gemini response:', text);

      // Clean up the response
      const cleanedText = this.cleanResponse(text);
      // console.log('Cleaned response:', cleanedText);

      return {
        message: cleanedText,
        context: [...context, { role: 'user', content: message }, { role: 'model', content: cleanedText }]
      };
    } catch (error) {
      this.logger.error('Error processing message:', error);
      throw new Error(`Error processing message: ${error.message}`);
    }
  }

  async getAllLaptops(): Promise<Laptop[]> {
    try {
      const laptops = await this.laptopRepository.find({
        order: {
          price: 'ASC'
        }
      });
      this.logger.log(`Found ${laptops.length} laptops in database`);
      return laptops;
    } catch (error) {
      this.logger.error('Error fetching laptops:', error);
      throw new Error(`Failed to fetch laptops: ${error.message}`);
    }
  }
}