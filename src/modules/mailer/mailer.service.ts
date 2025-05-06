import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPassword(email: string, token: string) {
    const url = `http://localhost:3000/reset-password?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Redefinição de Senha',
        text: `Clique no link para redefinir sua senha: ${url}`,
        html: `<p>Olá,</p>
               <p>Clique no link abaixo para redefinir sua senha:</p>
               <a href="${url}">${url}</a>
               <p>Se você não solicitou isso, ignore este e-mail.</p>`
      });
      return {
        message: 'Enviamos um link de redefinição.',
      };
    } catch (error) {
      throw new ServiceUnavailableException({
        error: error.message ?? error,
        message: 'Erro ao enviar o e-mail. Tente novamente mais tarde.',
      });
    }
  }
}
