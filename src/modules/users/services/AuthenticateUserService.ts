import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import authConfig from '../../../config/auth';
import IUsersRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import AppError from '../../../shared/errors/AppError';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
class AuthenticateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        // aqui estamos buscando um email, pra ver se ele bate do email que ja tam na base de dados, pq nao pode ter email duplicados
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        // user.password - Senha criptografada no banco
        // password - Senha que ele tentou fazer acesso, Senha nao criptografada
        const passwordMatched = await this.hashProvider.compareHash(
            password,
            user.password,
        );

        if (!passwordMatched) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        const { expiresIn, secret } = authConfig.jwt;

        // primeiro parametro do SIGN colocamos alguma informacao credencial, porem ela nao fica muito segura,
        // segundo parametro, passamos uma chave secreta, terceiro parametro sao algumas configuracoes do nosso token
        // subject ele sempre vai receber o ID do usuario, ṕra saber depois qual usuario pertence esse token, expiresIn é quanto tempo o token vai esta disponivel
        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return { user, token };
    }
}

export default AuthenticateUserService;
