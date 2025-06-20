// import { UserEntity } from "src/user/user.entity";
// import { UserService } from "src/user/user.service";
// import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// @Entity('blog_entity')
// export class BlogEntity {
//     @PrimaryGeneratedColumn()
//     id:number

//     @Column()
//     title:string

//     @Column()
//     slug:string

//     @Column({default: ''})
//     description:string

//     @Column({default: ''})
//     body:string

//     @Column({default:0})
//     likes:number

//     @Column({default:''})
//     headerImgae:string

//     @Column({nullable:true})
//     publishedDate:Date

//     @Column({default:false})
//     isPublished:boolean



//     @UpdateDateColumn({
//         name:'updated_at'
//     })
//     updatedAt:Date

//     @CreateDateColumn({
//         name:'created_at'
//     })
//     createdAt:Date

//     @ManyToOne(type => UserEntity, user => user.blogs)
//     author:UserEntity

// }