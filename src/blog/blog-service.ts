// import { Injectable } from "@nestjs/common";
// import { Repository } from "typeorm";
// import { BlogEntity } from "./blog-entity";
// import { UserService } from "src/user/user.service";
// import { User } from "src/user/user.interface";
// import { Blog } from "./blog-interface";
// import slugify from "slugify";
// import { InjectRepository } from "@nestjs/typeorm";
// import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";

// @Injectable()
// export class BlogService {
//     constructor(
//         @InjectRepository(BlogEntity) private readonly blogRepository:Repository<BlogEntity>,
//         private userService:UserService
//     ) { }
//     async create(user:User,blog:Blog):Promise<Blog> {
//         if(user.email) {
//         const foundUser = await this.userService.findByEmail(user.email)
//         if(!foundUser) throw new Error('user not found') 
//         blog.author = foundUser
//         const slug = await this.generateSlug(blog.title||'')
//         blog.slug = slug
//         return this.blogRepository.save(blog)
//     }else throw new Error('user email not given')
// }

//     async generateSlug(title:string):Promise<string>{
//         return await slugify(title) 
//     }

//     async findAll():Promise<Blog[]> {
//         return this.blogRepository.find()
//     }

//     // relations đảm bảo rằng thông tin chi tiết của tác giả (UserEntity)
//     //  sẽ được load cùng với blog entry. Điều này giúp bạn có được dữ liệu đầy đủ của tác giả
//     //  mà không cần thực hiện thêm một truy vấn riêng.
//     async findBlogByUser(userId:number):Promise<Blog[]> {
//         const arrayBlog = this.blogRepository.find({
//             where: {
//                 author:{id:userId}
//             },
//             relations:['author']
//         })
//         return arrayBlog
//     }
//     // k có realtions thì blog trả về cái trường author chỉ có id thôi k phải là 1 object
//     // Khi truy vấn, bạn có thể chỉ định điều kiện lọc cho author mà không cần phải viết rõ ràng author.id: userId. TypeORM sẽ tự động hiểu rằng:
//    //Nếu author là một entity, thì điều kiện author: userId sẽ so sánh giá trị của khóa chính (id) của entity đó với userId.
//     // Đây là một cách viết gọn và tiện lợi mà bạn không cần phải khai báo phức tạp.

//     async findOne(id:number):Promise<Blog | null> {
//         return await this.blogRepository.findOne({
//             where: {
//                 id:id
//             },
//             relations:['author']

//         })
//     }

//     async updateOne(id:number,blog:Blog):Promise<any> {
//         return await this.blogRepository.update(id,blog)
//     }

//     async deleteOne(id:number):Promise<any> {
//         return await this.blogRepository.delete(id)
//     }

//     async paginateAll(options: IPaginationOptions):Promise<Pagination<Blog>> {
//         const blogs = await paginate<Blog>(this.blogRepository,options,{
//             relations:['author']
//         })
//         return blogs
//     }
// }