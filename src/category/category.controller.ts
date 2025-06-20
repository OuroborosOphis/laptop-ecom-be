import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.interface';
import { hasRoles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async create(@Body() category: Category) {
    return await this.categoryService.createCategory(category);
  }

  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.categoryService.findOne(id);
  }

  @Put(':id')
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async update(@Param('id') id: number, @Body() category: Category) {
    return await this.categoryService.updateCategory(id, category);
  }

  @Delete(':id')
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  async delete(@Param('id') id: number) {
    return await this.categoryService.deleteCategory(id);
  }
}
