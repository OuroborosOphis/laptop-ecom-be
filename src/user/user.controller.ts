import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.interface';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UserRole } from './user.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import {v4 as uuidv4} from 'uuid'
import { join } from 'path';
import { ChangePassworDto} from './changePassword.dto';
import { MailService } from 'src/mail/mail.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
  ) {}

  // change password 
  @UseGuards(JwtGuard)
  @Put('/changepassword')
  async changePassword(@Req() req, @Body() changePasswordDto:ChangePassworDto):Promise<string>{
    const userId = Number(req.user.id) || 0
    return await this.userService.changePassword(userId,changePasswordDto)
  } 

  // forgot passwoed
  @Post('/forgot-password')
  async forgotPassword(@Body('email') email:string):Promise<any>{
    return await this.userService.forgotPassword(email)
  }
// reset password
@Post('/reset-password')
async resetPassword(@Body('token') token:string,@Body('newPassword') newPassword:string):Promise<any>{
  return await this.userService.resetPassword(token,newPassword)
}

  @Post('/create')
  async create(@Body() user: User): Promise<string> {
    return await this.userService.createUser(user);
  }

 
  @Get(':id')
  async findOne(@Param() params: any): Promise<any> {
    return await this.userService.findOne(params.id);
  }

  @Get()
  async findAll(): Promise<any> {
    return await this.userService.findAll();
  }

  
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtGuard,RoleGuard)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<any> {
    return this.userService.deletedOne(Number(id));
  }

  @Put(':id')
  async updateOne(@Param('id') id: string, @Body() user: User): Promise<any> {
    return await this.userService.updatedOne(Number(id),user);
  }
  @Post('/login')
  async login(@Body() user:User):Promise<string|{access_token:string}> {
    console.log(process.cwd())
    return await this.userService.login(user)
  }

  @Put(':id/role')
  async updateRoleUser(@Param('id') id:string,@Body() user:User){
    return await this.userService.updateRoleUser(Number(id),user)  
}
 
  @Get()
  async hello(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('userName') userName1:string
  ): Promise<Pagination<User>> {
    console.log(page)
    console.log(limit)
    console.log(userName1)
    if(!userName1){
      return await this.userService.paginateService({page:Number(page) || 1,limit:Number(limit) || 5,route:'http://localhost:3000/user'})
    }else return await this.userService.paginateByUserName({page:Number(page) || 1,limit:Number(limit) || 5,route:'http://localhost:3000/user'}, {userName:userName1})
  }

  // file handling 
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtGuard,RoleGuard)
  @Post('upload') 
  @UseInterceptors(FileInterceptor('file', {
    storage:diskStorage({
      destination:'./uploads/profileimages',
      filename:(req,file,cb)=> {
        const filename:string = path.parse(file.originalname).name.replace(/\s/g,'')+uuidv4()
        const extention:string = path.parse(file.originalname).ext
        cb(null,`${filename}${extention}`)
      }
    })
  }))
 async uploadFile(@UploadedFile() file,@Req() req):Promise<Object> {
    // console.log(file)
    const user:User = req.user.user 
    console.log(user)
    return await this.userService.updatedOneByEmail(user.email, {profileImage:file.filename})
    // return Promise.resolve({imagePath:file.filename})
  }

  // process.cwd() = D:\blog\blog-api
  @Get('profile-image/:imagename')
    findProfileImage(@Param('imagename') imagename,@Res() res):Promise<Object> {
      return res.sendFile(join(process.cwd(),'uploads/profileimages/'+imagename))
    }
}
