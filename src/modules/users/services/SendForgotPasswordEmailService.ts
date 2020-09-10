// recuperacao de senha
import path from 'path';

import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUserRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('IMailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
    ) {}

    public async execute({ email }: IRequest): Promise<void> {
        // checando se o email existe
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('User does not exists');
        }

        // gerando o token
        const { token } = await this.userTokensRepository.generate(user.id);

        const forgotPasswordTemplate = path.resolve(
            __dirname,
            '..',
            'views',
            'forgot_password.hbs',
        );

        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[Luc PetShop] Recuperação de senha',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `https://localhost:3000/reset_password?token=${token}`,
                },
            },
        });
    }
}

export default SendForgotPasswordEmailService;
