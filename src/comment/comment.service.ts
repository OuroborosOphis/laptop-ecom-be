import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async createComment(
    userId: number,
    productId: number,
    content: string,
  ): Promise<CommentEntity> {
    const comment = this.commentRepository.create({
      user: { id: userId },
      product: { id: productId },
      content,
    });
    return await this.commentRepository.save(comment);
  }

  async getCommentsByProduct(productId: number): Promise<CommentEntity[]> {
    return await this.commentRepository.find({
      where: { product: { id: productId } },
    });
  }

  async updateComment(id: number, content: string): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    comment.content = content;
    return await this.commentRepository.save(comment);
  }

  async deleteComment(id: number): Promise<void> {
    const result = await this.commentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Comment not found');
    }
  }
}
