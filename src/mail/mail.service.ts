import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'
import { Subject } from 'rxjs'
@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter

    constructor(private readonly configService:ConfigService) {
        this.transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user:"abcdef",
          pass:"abcdef",
        }
        })
    }

    async sendPasswordResetEmail(to:string,token:string){
        const resetLink =`http://localhost:3000/reset-password.html?token=${token}` 
        const mailOptions = {
            from:'phong vũ dịch vụ chăm sóc khách hàng',
            to:to,
            subject:'nothing',
            html:`<p>bạn yêu cầu reset mật khẩu vui lòng click link bên dưới để đổi mật khẩu:</p><p><a href="${resetLink}">reset mật khẩu</a></p>`
        }
        await this.transporter.sendMail(mailOptions)
    }
}