import { UserEntity } from "src/user/user.entity"
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class ResetTokenEntity {
    @PrimaryGeneratedColumn()
    id:number 

    @Column()
    token:string 

    @CreateDateColumn()
    cratedAt:Date

    @Column()
    expriedAt:Date

    @OneToOne(()=>UserEntity)
    @JoinColumn() // đánh dấu đây là cột giữ khóa ngoại userId
    user:UserEntity
}