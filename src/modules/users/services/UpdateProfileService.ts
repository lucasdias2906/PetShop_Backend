import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUserRepository';

interface IRequest {
    user_id: string; // de qual usuario eu quero atualizar o id
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    // atualizando usuario
    public async execute({
        user_id,
        name,
        email,
        old_password,
        password,
    }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found');
        }

        // verificando se ja existe um usuario com esse email que ele quer atualizar
        const userWithUpdatedEmail = await this.usersRepository.findByEmail(
            email,
        );

        // verificando pra ele validar, porem ele tem que ser diferente do email que o usuario tenha
        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError('E-mail already in use');
        }

        user.name = name;
        user.email = email;

        // querendo atualizar a senha mas nao passando a senha antiga
        if (password && !old_password) {
            throw new AppError(
                'You need to inform the old password to set a new password',
            );
        }

        // atualizando a senha, gerando hash da nova senha
        if (password && old_password) {
            // comparando a senha antiga com a senha antiga que o usuario escreveu
            const checkOldPassword = await this.hashProvider.compareHash(
                old_password,
                user.password,
            );
            if (!checkOldPassword) {
                throw new AppError('Old password does not match');
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);
    }
}

export default UpdateProfileService;
