import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/create')
  async createComment(
    @Body('userId') userId: number,
    @Body('productId') productId: number,
    @Body('content') content: string,
  ) {
    if (!userId || !productId || !content) {
      throw new Error('Missing required fields: userId, productId, or content');
    }
    return await this.commentService.createComment(userId, productId, content);
  }

  @Get('/getByProduct/:productId')
  async getCommentsByProduct(@Param('productId') productId: number) {
    return await this.commentService.getCommentsByProduct(productId);
  }

  @Put('/update/:id')
  async updateComment(
    @Param('id') id: number,
    @Body('content') content: string,
  ) {
    return await this.commentService.updateComment(id, content);
  }

  @Delete('/delete/:id')
  async deleteComment(@Param('id') id: number) {
    await this.commentService.deleteComment(id);
    return { message: 'Comment deleted successfully' };
  }
}
