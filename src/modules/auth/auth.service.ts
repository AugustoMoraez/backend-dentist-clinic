import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mailer/mailer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(@Inject()
  private prisma: DatabaseService,
    private jwtService: JwtService,
    private config: ConfigService,
    private mailService: MailService
  ) { }

   async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.config.get("JWT_ACCESS_TOKEN"),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.config.get("JWT_REFRESH_SECRET"),
    });

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }
  async handleRequestVerification(email: string) {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    try {
      await this.prisma.accountVerifyToken.upsert({
        where: { email },
        update: {
          token,
          expiresAt,
        },
        create: {
          email,
          token,
          expiresAt,
        },
      });
    } catch (error) {
      throw new ServiceUnavailableException({
        error: error.message ?? error,
        message: 'Erro ao salvar token. Tente novamente mais tarde.',
      });
    }

    return await this.mailService.sendVerificationToken(email, token);
  }
  async handleForgotPassword(email: string) {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    try {
      await this.prisma.passwordResetToken.upsert({
        where: { email },
        update: {
          token,
          expiresAt,
        },
        create: {
          email,
          token,
          expiresAt,
        },
      });
    } catch (error) {
      throw new ServiceUnavailableException({
        error: error.message ?? error,
        message: 'Erro ao salvar token. Tente novamente mais tarde.',
      });
    }

    return await this.mailService.sendResetPassword(email, token);
  }
  async handleVerificationAccount(token: string) {
    const record = await this.prisma.accountVerifyToken.findUnique({ where: { token } });

    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException('Token inválido ou expirado');
    }
    try {
      await this.prisma.user.update({
        where: { email: record.email },
        data: { AccountVerification: true },
      });

      await this.prisma.accountVerifyToken.delete({ where: { token } });

    } catch (error) {
      throw new ServiceUnavailableException({
        erro: error,
        msg: "Erro, tente novamente mais tarde"
      })
    }

    return { message: 'Conta ativa com sucesso' };
  }
  async handleResetPassword(token: string, newPassword: string) {
    const record = await this.prisma.passwordResetToken.findUnique({ where: { token: token } });

    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException('Token inválido ou expirado');
    }


    const hashed = await bcrypt.hash(newPassword, 10);
    try {
      await this.prisma.user.update({
        where: { email: record.email },
        data: { password: hashed },
      });

      await this.prisma.passwordResetToken.delete({ where: { token } });

    } catch (error) {
      throw new ServiceUnavailableException({
        erro: error,
        msg: "Erro, tente novamente mais tarde"
      })
    }

    return { message: 'Senha redefinida com sucesso' };
  }
}

