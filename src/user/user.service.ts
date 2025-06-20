import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserEntity, UserRole } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './user.interface';
import { AuthService } from 'src/auth/auth.service';
import {IPaginationOptions,Pagination,paginate} from 'nestjs-typeorm-paginate'
import { ChangePassworDto } from './changePassword.dto';
import { nanoid } from 'nanoid';
import { ResetTokenDto } from 'src/resetToken/resetToken.dto';
import { ResetTokenService } from 'src/resetToken/resetToken.service';
import { MailService } from 'src/mail/mail.service';
const bcrypt = require('bcrypt');
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
    private readonly mailService:MailService,
    @Inject(forwardRef(() => ResetTokenService))
    private readonly resetTokenService: ResetTokenService
  ) {}

async createUser(user: User): Promise<any> {
    try {
      const passwordHash = await this.authService.hashPassword(user.password ?? '');

      // create new user
      const newUser = new UserEntity();
      newUser.name = user.name ?? '';
      newUser.email = user.email ?? '';
      newUser.userName = user.userName ?? '';
      newUser.role= user.role ?? UserRole.USER;
      newUser.password = passwordHash;

      const savedUser = await this.userRepository.save(newUser);

      const { password, ...res } = savedUser;
      return res;
    } catch (error) {
      throw new Error(error);
    }
  }
  async findAll(): Promise<any[]> {
    const arrayUser = await this.userRepository.find();
    return arrayUser
  }
  
  async findOne(id: number): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id } });
    if(user){
    const  {password,...res} = user
    return Promise.resolve(res)
    } 
  }
  deletedOne(id: number): Promise<any> {
    return this.userRepository.delete(id);
  }
 async updatedOne(id: number, user: User): Promise<any> {
    if(user.password){
    const hashPassword = await this.authService.hashPassword(user.password)
    const {password,...res} = user
    return  await this.userRepository.update(id,{...res,password:hashPassword});
    }
    return await this.userRepository.update(id,user)
  }
async updatedOneByEmail(email:string| undefined,user:User):Promise<any>{
  if(!email){
    throw new Error('email required')
  }
  const existedUser = await this.findByEmail(email)
  if(!existedUser) {
        throw new Error('user not found')
    }
  return await this.userRepository.update({email},user)
}

  async findByEmail(email:string) :Promise<User|null> {
    try {
        const user = await this.userRepository.findOne({where:{email}})
        return user
    } catch (error) {
        throw new Error(error)
    }
  }

  async validateUser(email:string,password:string):Promise<Boolean> {
    try {
        const user = await this.userRepository.findOne({where:{email}})
        if(!user) return false
        const compare =await this.authService.comparePassword(password,user.password)
        if(compare == false) return false
        return true
    } catch (error) {
        throw new Error(error)
    }
  }

  async login(user:User): Promise<string|{access_token:string}> {
    try {
      const validatedUser = await this.validateUser(user.email ?? '',user.password ?? '') 
      if(!validatedUser) return 'login failed'
      
      // Get full user info from database
      const fullUser = await this.userRepository.findOne({where: {email: user.email}})
      if (!fullUser) return 'user not found'
      
      // Create token with full user info
      const token = await this.authService.genarateToken({
        id: fullUser.id,
        email: fullUser.email,
        name: fullUser.name,
        role: fullUser.role,
        userName: fullUser.userName
      })
      
      return {access_token: token}
    } catch (error) {
      throw new Error(error)
    }
  }

  async updateRoleUser(id:number,user:User):Promise<any> {
      return await this.userRepository.update(id,user)
  }
  async paginateService(options:IPaginationOptions):Promise<Pagination<User>> {
    const userArray =  await paginate<User>(this.userRepository,options)
    userArray.items.forEach((v)=> {
      delete v.password
    })
    return userArray
  }
  async paginateByUserName(options:IPaginationOptions, user:User):Promise<any> {
    const arrayUserSort = await this.userRepository.findAndCount({
      take:Number(options.limit) ,
      skip:(Number(options.page)-1)*Number(options.limit),
      order:{id:"ASC"},
      select:['id','name','userName','email','role'],
      where:[
        {userName:Like(`%${user.userName}%`)}
      ]
    })
    // định dạng chuẩn
    // là 1 mảng trả về 2 phần tử 1 là array các kết quả 2 là số lượng kết quả 
    const users = arrayUserSort[0]
    const totalUsers = arrayUserSort[1]

    const userPageable:Pagination<User> = {
      items:users,
      meta: {
        totalItems: totalUsers,
        itemCount: users.length,
        itemsPerPage: Number(options.limit),
        totalPages: Math.ceil(totalUsers / Number(options.limit)),
        currentPage: Number(options.page)
      },
      links: {
        first:options.route + `?limit=${options.limit}` + `&userName=${user.userName}`,
        previous:Number(options.page) > 1 ? options.route + `?page=${Number(options.page)-1}` + `&limit=${options.limit}` + `&userName=${user.userName}` : '',
        next: options.route + `?page=${Number(options.page)+1}` + `&limit=${options.limit}` + `&userName=${user.userName}`,
        last:options.route + `?page=${Math.ceil(totalUsers/Number(options.limit))}` + `&userName=${user.userName}`
      }
    }
    return userPageable
  }

  // change password
  async changePassword(userId:number,changePasswordDto:ChangePassworDto):Promise<string> {
    const user = await this.userRepository.findOne({where:{id:userId}})
    if(!user) return "user not found"

    const matchPassword = await bcrypt.compare(changePasswordDto.currentPassword,user?.password)
    if(!matchPassword) return "user password not correct"

    const newHashPassword = await this.authService.hashPassword(changePasswordDto.newPassword)
    user.password = newHashPassword

    await this.userRepository.save(user)
    return "change password success"

  }
  //forgot password
  async forgotPassword(email:string) :Promise<any>{
    const user = await this.userRepository.findOne({where:{email}})
    if(!user) return "email khong ton tai"
    // new reset token dto
    const resetToken = new ResetTokenDto()
    const token:string = nanoid(64)
    const expiredDate = new Date(Date.now() + 15*60*1000)
    const userId = user.id

    resetToken.userId = userId
    resetToken.token = token
    resetToken.expriedAt = expiredDate
    
    const tokenInformation = await this.resetTokenService.create(resetToken)

    await this.mailService.sendPasswordResetEmail(email,token)

    return "send email success"

  }

  async resetPassword(token:string,newPassword:string):Promise<any>{
    // check token có tồn tại trong db k đề phòng fake token
    const resetToken = await this.resetTokenService.findOne(token)
    if(!resetToken) return "token not found"

    // check token có hạn hay không
    if(resetToken.expriedAt < new Date()){
      return "token expired"
    }else {
    

    // check user có tồn tại trong db k
    const user = await this.userRepository.findOne({where:{id:resetToken.user.id}})
    if(!user) return "user not found"

    // hash password mới
    const newHashPassword = await this.authService.hashPassword(newPassword)
    user.password = newHashPassword

    // lưu password mới vào db
    await this.userRepository.save(user)
    return "reset password success"
    }
  }
}
