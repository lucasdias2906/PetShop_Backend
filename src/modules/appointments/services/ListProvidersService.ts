// Listando os prestadores de serviço, mostrando todos os prestadores de servico MENOS os usuarios
import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

// import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUserRepository';

interface IRequest {
    user_id: string; // de qual usuario eu quero atualizar o id
}

@injectable()
class ListProvidersService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    // listando os prestadores de servico, MENOS o user_id
    public async execute({ user_id }: IRequest): Promise<User[]> {
        const users = await this.usersRepository.findAllProviders({
            expept_user_id: user_id,
        });

        return users;
    }
}

export default ListProvidersService;
