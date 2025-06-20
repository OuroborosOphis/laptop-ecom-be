// import { Blog } from "src/blog/blog-interface"
import { UserRole } from "./user.entity"

export interface User {
    id?:number
    userName?:string
    name?:string 
    email?:string
    password?:string
    role?:UserRole
    profileImage?:string,
}