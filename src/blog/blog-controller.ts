// import { Body, Controller, Post, Query, Request, UseGuards,Get, Param,Put, Delete } from "@nestjs/common";
// import { BlogService } from "./blog-service";
// import { Blog } from "./blog-interface";
// import { JwtGuard } from "src/auth/guards/jwt.guard";
// import { UserIsAuthorGuard } from "src/auth/guards/user-is-author-guard";

// @Controller('blog')
// export class BlogController {
//     constructor(private blogService:BlogService) { }

//     @UseGuards(JwtGuard)    
//     @Post()
//     async create(@Body() blog:Blog,@Request() req):Promise<Blog> {
//         const user = req.user.user
//         return await this.blogService.create(user,blog)
//     }

//     @Get()
//     async findBlog(@Query('userId') userId:string):Promise<Blog[]> {
//         if(!userId) {
//             return await this.blogService.findAll()
//         } else {
//             return await this.blogService.findBlogByUser(Number(userId))
//         }
//     }

//     @Get(':id')
//     async findOne(@Param('id') id:string):Promise<Blog|null> {
//         return await this.blogService.findOne(Number(id))
//     }

//     @UseGuards(JwtGuard,UserIsAuthorGuard)
//     @Put(':id')
//     async updateOne(@Param('id') id:string, @Body() blog:Blog): Promise<any> {
//         return await this.blogService.updateOne(Number(id),blog) 
//     }

//     @UseGuards(JwtGuard,UserIsAuthorGuard)
//     @Delete(':id')
//     async deleteOne(@Param('id') id:string): Promise<any> {
//         return await this.blogService.deleteOne(Number(id)) 
//     }

//     @Get('')
//     index(
//         @Query('page') page: string,
//         @Query('limit') limit: string
//     ) {
//         if(!page) page = '1'
//         if(!limit) limit = '10'
//         return this.blogService.paginateAll({
//             limit:Number(limit),
//             page:Number(page),
//             route:'http://localhost:3000/blog'
//         })
//     }
// }