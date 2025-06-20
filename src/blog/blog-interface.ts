import { User } from "src/user/user.interface";

export interface Blog {
    id?:number,
    title?:string,
    slug?:string,
    description?:string,
    body?:string,
    createdAt?:Date,
    updatetedAt?:Date,
    likes?:number,
    author?:User,
    headerImage?:string,
    publishedDate?:Date,
    isPublished?:boolean
}