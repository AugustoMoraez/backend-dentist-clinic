import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(@Inject() 
  private prisma: DatabaseService, 
  private jwtService:JwtService,
  private mailService:MailService
) {}

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const payload = {username:user.email,sub:user.id};

    return {...user,token:this.jwtService.sign(payload)};

  }
  async SendLinkResetPassword(email:string){
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos

     await this.prisma.passwordResetToken.create({
      data:{
        token,
        expiresAt,
        email
      }
     })
     
     await this.mailService.sendResetPassword(email,token)

    return { message: 'Link de redefinição enviado por e-mail.' };
  }


  
  // async resetPassword(token: string, newPassword: string) {
  //   const record = await this.prisma.passwordResetToken.findUnique({ where: { token } });

  //   if (!record || record.expiresAt < new Date()) {
  //     throw new BadRequestException('Token inválido ou expirado');
  //   }

  //   const hashed = await bcrypt.hash(newPassword, 10);

  //   await this.prisma.user.update({
  //     where: { id: record.userId },
  //     data: { password: hashed },
  //   });

  //   await this.prisma.passwordResetToken.delete({ where: { token } });

  //   return { message: 'Senha redefinida com sucesso' };
  // }
}

